const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (or create it if it doesn't exist)
const dbPath = path.resolve(__dirname, 'college.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        program TEXT NOT NULL,
        message TEXT,
        submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating applications table:', err.message);
        } else {
            console.log('Applications table ready.');
        }
    });
});

module.exports = db;
