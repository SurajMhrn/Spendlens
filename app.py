import sqlite3
import json
from flask import Flask, render_template, request, jsonify, g

app = Flask(__name__)
DATABASE = 'spendlens.db'

# --- Database Helper Functions ---

def get_db():
    """Get a connection to the SQLite database."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        # Use Row objects to access columns by name
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Close the database connection at the end of the request."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize the database with the required tables."""
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# --- Database Schema (schema.sql) ---
# We'll create a separate file for the schema
# This function is here to show what init_db needs.
# You will need to create a 'schema.sql' file with the content
# I'll provide in the README.

@app.cli.command('init-db')
def init_db_command():
    """Defines a command-line command 'flask init-db' to create tables."""
    init_db()
    print('Initialized the database.')

# --- Main Route ---

@app.route('/')
def index():
    """Serve the main index.html file from the 'templates' folder."""
    return render_template('index.html')

# --- API Endpoints ---

@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Load all data for the application on initial load."""
    db = get_db()
    
    # 1. Get Settings
    settings_rows = db.execute('SELECT key, value FROM settings').fetchall()
    settings = {}
    for row in settings_rows:
        try:
            # Try to parse JSON for budgets/incomes
            settings[row['key']] = json.loads(row['value'])
        except (json.JSONDecodeError, TypeError):
            # Fallback for simple strings (like userName)
            settings[row['key']] = row['value']

    # 2. Get Expenses (ordered by most recent)
    expenses = [dict(row) for row in db.execute('SELECT * FROM expenses ORDER BY id DESC').fetchall()]
    
    # 3. Get Payments
    payments = [dict(row) for row in db.execute('SELECT * FROM payments ORDER BY date ASC').fetchall()]
    
    # 4. Get Photos
    photos = [dict(row) for row in db.execute('SELECT * FROM photos ORDER BY expenseId DESC').fetchall()]
    
    # 5. Consolidate and return
    data = {
        'userName': settings.get('userName', 'User'),
        'budgets': settings.get('budgets', {}),
        'incomes': settings.get('incomes', {}),
        'allExpenses': expenses,
        'upcomingPayments': payments,
        'allBillPhotos': photos
    }
    return jsonify(data)

@app.route('/api/settings', methods=['POST'])
def save_setting():
    """Save a single setting (userName, budgets, incomes)."""
    data = request.get_json()
    key = data.get('key')
    value = data.get('value')
    
    if not key or value is None:
        return jsonify({'error': 'Missing key or value'}), 400
        
    # Serialize complex values (budgets, incomes) to JSON strings
    if isinstance(value, (dict, list)):
        value = json.dumps(value)
        
    db = get_db()
    db.execute(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        (key, value)
    )
    db.commit()
    return jsonify({'success': True, 'key': key, 'value': data.get('value')})

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    """Add a new expense."""
    data = request.get_json()
    db = get_db()
    cursor = db.execute(
        '''
        INSERT INTO expenses (date, "desc", cat, amount, type, paymentMethod, location, mood, billPhoto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''',
        (
            data['date'], data['desc'], data['cat'], data['amount'], data['type'],
            data['paymentMethod'], data['location'], data['mood'], data['billPhoto']
        )
    )
    db.commit()
    
    new_expense_id = cursor.lastrowid
    # Fetch the newly created expense to return it with the ID
    new_expense = db.execute('SELECT * FROM expenses WHERE id = ?', (new_expense_id,)).fetchone()
    
    return jsonify(dict(new_expense)), 201

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an existing expense."""
    data = request.get_json()
    db = get_db()
    db.execute(
        '''
        UPDATE expenses
        SET date = ?, "desc" = ?, cat = ?, amount = ?, type = ?, paymentMethod = ?,
            location = ?, mood = ?, billPhoto = ?
        WHERE id = ?
        ''',
        (
            data['date'], data['desc'], data['cat'], data['amount'], data['type'],
            data['paymentMethod'], data['location'], data['mood'], data['billPhoto'],
            expense_id
        )
    )
    db.commit()
    
    updated_expense = db.execute('SELECT * FROM expenses WHERE id = ?', (expense_id,)).fetchone()
    if updated_expense is None:
        return jsonify({'error': 'Expense not found'}), 404
        
    return jsonify(dict(updated_expense))

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense and its associated photo."""
    db = get_db()
    # Delete the photo first
    db.execute('DELETE FROM photos WHERE expenseId = ?', (expense_id,))
    # Then delete the expense
    db.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
    db.commit()
    return jsonify({'success': True}), 200

@app.route('/api/payments', methods=['POST'])
def add_payment():
    """Add a new upcoming payment."""
    data = request.get_json()
    db = get_db()
    cursor = db.execute(
        '''
        INSERT INTO payments ("desc", amount, date, isRepeating, repeatDays)
        VALUES (?, ?, ?, ?, ?)
        ''',
        (data['desc'], data['amount'], data['date'], data['isRepeating'], data['repeatDays'])
    )
    db.commit()
    
    new_payment_id = cursor.lastrowid
    new_payment = db.execute('SELECT * FROM payments WHERE id = ?', (new_payment_id,)).fetchone()
    
    return jsonify(dict(new_payment)), 201

@app.route('/api/payments/<int:payment_id>', methods=['PUT'])
def update_payment(payment_id):
    """Update an upcoming payment (e.g., set new date)."""
    data = request.get_json()
    db = get_db()
    db.execute(
        'UPDATE payments SET date = ? WHERE id = ?',
        (data['date'], payment_id)
    )
    db.commit()
    
    updated_payment = db.execute('SELECT * FROM payments WHERE id = ?', (payment_id,)).fetchone()
    if updated_payment is None:
        return jsonify({'error': 'Payment not found'}), 404
        
    return jsonify(dict(updated_payment))

@app.route('/api/payments/<int:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    """Delete an upcoming payment."""
    db = get_db()
    db.execute('DELETE FROM payments WHERE id = ?', (payment_id,))
    db.commit()
    return jsonify({'success': True}), 200

@app.route('/api/photos', methods=['POST'])
def add_or_update_photo():
    """Add or update a bill photo."""
    data = request.get_json()
    db = get_db()
    db.execute(
        '''
        INSERT OR REPLACE INTO photos (expenseId, dataUrl, date, description)
        VALUES (?, ?, ?, ?)
        ''',
        (data['expenseId'], data['dataUrl'], data['date'], data['description'])
    )
    db.commit()
    
    saved_photo = db.execute('SELECT * FROM photos WHERE expenseId = ?', (data['expenseId'],)).fetchone()
    return jsonify(dict(saved_photo)), 201

@app.route('/api/photos/<int:expense_id>', methods=['DELETE'])
def delete_photo(expense_id):
    """Delete a photo and update the corresponding expense."""
    db = get_db()
    # Delete the photo
    db.execute('DELETE FROM photos WHERE expenseId = ?', (expense_id,))
    # Update the expense to reflect no bill photo
    db.execute('UPDATE expenses SET billPhoto = 0 WHERE id = ?', (expense_id,))
    db.commit()
    return jsonify({'success': True}), 200

if __name__ == '__main__':
    app.run(debug=True)