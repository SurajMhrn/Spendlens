-- Drop tables if they already exist, to start fresh
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS photos;

-- Stores all individual expense transactions
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    cat TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT,
    paymentMethod TEXT,
    location TEXT,
    mood TEXT,
    billPhoto INTEGER DEFAULT 0 -- Use 0 for false, 1 for true
);

-- A key-value store for app settings like userName, budgets, and incomes
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- Stores upcoming/recurring payments
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "desc" TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    isRepeating INTEGER DEFAULT 0,
    repeatDays INTEGER DEFAULT 0
);

-- Stores base64-encoded bill photos
CREATE TABLE photos (
    expenseId INTEGER PRIMARY KEY, -- Links 1-to-1 with an expense
    dataUrl TEXT NOT NULL,
    date TEXT,
    description TEXT,
    FOREIGN KEY (expenseId) REFERENCES expenses (id) ON DELETE CASCADE
);
