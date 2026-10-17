// Creates the database (schema is applied in src/db.js) and adds sample data.
require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('../src/db');

const DEMO_USER = {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
};

const SAMPLE_TASKS = [
    {
        title: 'Write requirements document',
        description: 'Functional and non-functional requirements for the SRS.',
        priority: 'high',
        due_date: '2026-10-20',
        status: 'done',
    },
    {
        title: 'Draw use-case diagram',
        description: 'Cover sign up, log in and task management.',
        priority: 'medium',
        due_date: '2026-10-22',
        status: 'in_progress',
    },
    {
        title: 'Set up Kanban board UI',
        description: 'Three columns: To Do, In Progress, Done.',
        priority: 'high',
        due_date: '2026-10-25',
        status: 'todo',
    },
    {
        title: 'Write test cases',
        description: '',
        priority: 'low',
        due_date: null,
        status: 'todo',
    },
];

const seed = db.transaction(() => {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(DEMO_USER.email);
    if (existing) {
        return false;
    }

    const { lastInsertRowid: userId } = db
        .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
        .run(DEMO_USER.name, DEMO_USER.email, bcrypt.hashSync(DEMO_USER.password, 10));

    const insertTask = db.prepare(
        `INSERT INTO tasks (user_id, title, description, priority, due_date, status)
         VALUES (@userId, @title, @description, @priority, @due_date, @status)`
    );
    for (const task of SAMPLE_TASKS) {
        insertTask.run({ userId, ...task });
    }
    return true;
});

if (seed()) {
    console.log(`Database ready. Sample user: ${DEMO_USER.email} / ${DEMO_USER.password}`);
} else {
    console.log('Database ready. Sample data already present, nothing added.');
}
