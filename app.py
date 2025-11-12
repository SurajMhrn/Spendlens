import os
import json
from flask import Flask, render_template, request, jsonify, g
from redis import Redis
from dotenv import load_dotenv

# Load environment variables from a .env file (for local testing)
load_dotenv()

app = Flask(__name__)
# Vercel will provide this environment variable
DATABASE_URL = os.getenv('KV_URL') 

# --- Database Helper Functions (Using Redis) ---

def get_db():
    """Get a connection to the Vercel KV (Redis) database."""
    if 'db' not in g:
        try:
            if not DATABASE_URL:
                raise ValueError("KV_URL environment variable is not set.")
            # decode_responses=True makes sure we get strings back, not bytes
            g.db = Redis.from_url(DATABASE_URL, decode_responses=True)
            g.db.ping() # Test the connection
        except Exception as e:
            print(f"Error connecting to Redis: {e}")
            g.db = None
    return g.db

@app.teardown_appcontext
def close_connection(exception):
    """Close the database connection at the end of the request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

# --- Helper to parse data from Redis ---
def parse_redis_hash(redis_hash, sort_key=None, reverse=False):
    """Converts a Redis hash {id: json_string} to a list of dicts."""
    try:
        items = [json.loads(item_json) for item_json in redis_hash.values()]
        if sort_key:
            items.sort(key=lambda x: x.get(sort_key, 0) or 0, reverse=reverse)
        return items
    except Exception:
        return []

# --- Main Route ---

@app.route('/')
def index():
    """Serve the main index.html file from the 'templates' folder."""
    return render_template('index.html')

# --- API Endpoints (rewritten for Vercel KV) ---

@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Load all data for the application on initial load."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed. Check KV_URL.'}), 500
        
    # 1. Get Settings (stored as simple keys)
    keys = ['userName', 'budgets', 'incomes']
    values = db.mget(keys)
    settings_data = dict(zip(keys, values))
    
    # 2. Get Lists (stored as Hashes)
    pipe = db.pipeline()
    pipe.hgetall('expenses')
    pipe.hgetall('payments')
    pipe.hgetall('photos')
    results = pipe.execute()
    
    expenses_hash, payments_hash, photos_hash = results
    
    # 3. Consolidate and return
    data = {
        'userName': settings_data.get('userName') or 'User',
        'budgets': json.loads(settings_data.get('budgets') or '{}'),
        'incomes': json.loads(settings_data.get('incomes') or '{}'),
        'allExpenses': parse_redis_hash(expenses_hash, sort_key='id', reverse=True),
        'upcomingPayments': parse_redis_hash(payments_hash, sort_key='date'),
        'allBillPhotos': parse_redis_hash(photos_hash, sort_key='expenseId', reverse=True)
    }
    return jsonify(data)

@app.route('/api/settings', methods=['POST'])
def save_setting():
    """Save a single setting (userName, budgets, incomes)."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    data = request.get_json()
    key = data.get('key')
    value = data.get('value')
    
    if not key or value is None:
        return jsonify({'error': 'Missing key or value'}), 400
        
    if isinstance(value, (dict, list)):
        value = json.dumps(value)
        
    db.set(key, value)
    return jsonify({'success': True, 'key': key, 'value': data.get('value')})

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    """Add a new expense."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    data = request.get_json()
    
    # Generate a new unique ID from Redis
    new_expense_id = db.incr('next_expense_id')
    data['id'] = new_expense_id
    
    # Store the expense in the 'expenses' hash
    db.hset('expenses', new_expense_id, json.dumps(data))
    
    return jsonify(data), 201

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an existing expense."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    data = request.get_json()
    data['id'] = expense_id
    
    db.hset('expenses', expense_id, json.dumps(data))
    return jsonify(data)

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense and its associated photo."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    pipe = db.pipeline()
    pipe.hdel('expenses', expense_id) 
    pipe.hdel('photos', expense_id)   
    pipe.execute()
    
    return jsonify({'success': True}), 200

@app.route('/api/payments', methods=['POST'])
def add_payment():
    """Add a new upcoming payment."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    data = request.get_json()
    new_payment_id = db.incr('next_payment_id')
    data['id'] = new_payment_id
    
    db.hset('payments', new_payment_id, json.dumps(data))
    return jsonify(data), 201

@app.route('/api/payments/<int:payment_id>', methods=['PUT'])
def update_payment(payment_id):
    """Update an upcoming payment (e.g., set new date)."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    data = request.get_json()
    
    existing_payment_json = db.hget('payments', payment_id)
    if not existing_payment_json:
        return jsonify({'error': 'Payment not found'}), 404
        
    existing_payment = json.loads(existing_payment_json)
    existing_payment['date'] = data.get('date', existing_payment['date'])
    
    db.hset('payments', payment_id, json.dumps(existing_payment))
    return jsonify(existing_payment)

@app.route('/api/payments/<int:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    """Delete an upcoming payment."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    db.hdel('payments', payment_id)
    return jsonify({'success': True}), 200

@app.route('/api/photos', methods=['POST'])
def add_or_update_photo():
    """Add or update a bill photo. Uses expenseId as the key."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    data = request.get_json()
    expense_id = data.get('expenseId')
    if not expense_id:
        return jsonify({'error': 'expenseId is required'}), 400
        
    db.hset('photos', expense_id, json.dumps(data))
    return jsonify(data), 201

@app.route('/api/photos/<int:expense_id>', methods=['DELETE'])
def delete_photo(expense_id):
    """Delete a photo and update the corresponding expense."""
    db = get_db()
    if db is None:
        return jsonify({'error': 'Database connection failed'}), 500
        
    expense_json = db.hget('expenses', expense_id)
    if expense_json:
        expense = json.loads(expense_json)
        expense['billPhoto'] = False
        
        pipe = db.pipeline()
        pipe.hset('expenses', expense_id, json.dumps(expense))
        pipe.hdel('photos', expense_id)
        pipe.execute()
    else:
        # If no expense, just delete the photo
        db.hdel('photos', expense_id)

    return jsonify({'success': True}), 200

# This is used by Vercel to run the app
if __name__ == '__main__':
    app.run(debug=True)
```eof
```markdown:requirements.txt (REPLACE your old one with this)
Flask
redis
python-dotenv
gunicorn
```eof
```markdown:.gitignore (ADD this file to your project)
# Environment variables
.env
.env.*
*.env

# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd

# Vercel
.vercel/

# IDE files
.vscode/
.idea/

# SQLite Database - DO NOT DEPLOY
*.db
*.db-journal
schema.sql
```eof

---

## 2. 🚀 Step-by-Step Deployment Guide

Follow these steps exactly.

### Step 1: Update Your Local Project

1.  **Replace `app.py`:** Delete your old `app.py` and save the new one above in its place.
2.  **Replace `requirements.txt`:** Replace your old `requirements.txt` [cite: 257] with the new one above. This adds `redis` and `gunicorn`, which Vercel needs.
3.  **Add `.gitignore`:** Create a new file named `.gitignore` in your project's main folder and paste the content above into it.
4.  **Delete Old Files:** You can now safely delete `spendlens.db` [cite: 1] and `schema.sql` from your project folder. They are not needed for the Vercel deployment.

### Step 2: Push to GitHub

Vercel deploys directly from a GitHub repository. If you haven't done this yet, you need to:

1.  Create a new, empty repository on [GitHub](https://github.com/new).
2.  In your project folder, run these commands in your terminal:
    ```bash
    git init -b main
    git add .
    git commit -m "Migrate to Vercel KV for deployment"
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```
    *(If you've already connected to GitHub, just run `git add .`, `git commit -m "Fix for Vercel"`, and `git push`)*

### Step 3: Create the Vercel Project & Database

This is the most important step.

1.  Sign in to your [Vercel](https://vercel.com) account.
2.  On your dashboard, click **Add New...** > **Project**.
3.  **Import** the GitHub repository you just pushed your code to.
4.  Vercel will detect it's a Flask app. Before you click "Deploy", click the **Storage** tab at the top.
5.  Find **KV (New)** and click **Create Database**.
6.  Give it a name (like `spendlens-db`) and select a region.
7.  After creating it, **Connect** it to your project using the dropdown menu and click the **"Connect"** button.
    
This connection step is what automatically gives your app the secret `KV_URL` it needs to work.

### Step 4: Deploy

1.  Go back to the **Deployments** tab for your project.
2.  Vercel may have already started a new deployment from your latest `git push`. If not, trigger a new one by clicking the "Redeploy" button.
3.  Vercel will now:
    * Install `Flask`, `redis`, and `gunicorn` from your new `requirements.txt`.
    * Build the app using your new `app.py`.
    * Connect to your Vercel KV database using the `KV_URL`.

Once it's finished, your site will be live and fully working!
