require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('../src/db');

const existing = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@example.com');

if (existing) {
    console.log('Sample data already added');
} else {
    const result = db
        .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
        .run('Demo User', 'demo@example.com', bcrypt.hashSync('password123', 10));

    const userId = result.lastInsertRowid;

    const addTask = db.prepare(
        'INSERT INTO tasks (user_id, title, description, priority, due_date, status) VALUES (?, ?, ?, ?, ?, ?)'
    );

    addTask.run(userId, 'Write requirements document', 'Functional and non-functional requirements', 'high', '2026-10-20', 'done');
    addTask.run(userId, 'Draw use-case diagram', 'Sign up, log in and task management', 'medium', '2026-10-22', 'in_progress');
    addTask.run(userId, 'Make Kanban board page', 'To Do, In Progress and Done columns', 'high', '2026-10-25', 'todo');
    addTask.run(userId, 'Write test cases', '', 'low', null, 'todo');

    console.log('Sample data added. Login with demo@example.com / password123');
}
