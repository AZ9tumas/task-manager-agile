const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFile = process.env.DB_FILE || './data/tasks.db';

if (dbFile !== ':memory:') {
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
}

const db = new Database(dbFile);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        priority TEXT DEFAULT 'medium',
        due_date TEXT,
        status TEXT DEFAULT 'todo',
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`);

module.exports = db;
