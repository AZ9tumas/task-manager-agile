const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

const statuses = ['todo', 'in_progress', 'done'];
const priorities = ['low', 'medium', 'high'];

function checkTask(task) {
    if (typeof task.title !== 'string' || task.title.trim() === '') {
        return 'Title is required';
    }
    if (!priorities.includes(task.priority)) {
        return 'Priority must be low, medium or high';
    }
    if (!statuses.includes(task.status)) {
        return 'Status must be todo, in_progress or done';
    }
    if (task.due_date && (!/^\d{4}-\d{2}-\d{2}$/.test(task.due_date) || isNaN(Date.parse(task.due_date)))) {
        return 'Due date is not valid';
    }
    return null;
}

function findTask(id, userId) {
    return db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
}

router.get('/', (req, res) => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.userId);
    res.json({ tasks: tasks });
});

router.post('/', (req, res) => {
    const task = {
        title: req.body.title,
        description: req.body.description || '',
        priority: req.body.priority || 'medium',
        due_date: req.body.due_date || null,
        status: req.body.status || 'todo',
    };

    const error = checkTask(task);
    if (error) {
        return res.status(400).json({ error: error });
    }

    const result = db
        .prepare(
            'INSERT INTO tasks (user_id, title, description, priority, due_date, status) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .run(req.userId, task.title.trim(), task.description, task.priority, task.due_date, task.status);

    res.status(201).json({ task: findTask(result.lastInsertRowid, req.userId) });
});

router.put('/:id', (req, res) => {
    const oldTask = findTask(req.params.id, req.userId);

    if (!oldTask) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const task = { ...oldTask, ...req.body };

    const error = checkTask(task);
    if (error) {
        return res.status(400).json({ error: error });
    }

    db.prepare(
        'UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ?, status = ? WHERE id = ?'
    ).run(task.title.trim(), task.description, task.priority, task.due_date || null, task.status, oldTask.id);

    res.json({ task: findTask(oldTask.id, req.userId) });
});

router.delete('/:id', (req, res) => {
    const result = db
        .prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
        .run(req.params.id, req.userId);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
});

module.exports = router;
