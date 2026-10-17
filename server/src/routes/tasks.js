const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];
const MAX_TITLE_LENGTH = 200;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Returns { data } with only the recognised fields, or { error }.
// With partial = true (updates), title becomes optional.
function validateTask(body, { partial = false } = {}) {
    const data = {};

    if (!partial || body.title !== undefined) {
        if (typeof body.title !== 'string' || !body.title.trim()) {
            return { error: 'Title is required' };
        }
        if (body.title.trim().length > MAX_TITLE_LENGTH) {
            return { error: `Title must be at most ${MAX_TITLE_LENGTH} characters` };
        }
        data.title = body.title.trim();
    }

    if (body.description !== undefined) {
        if (typeof body.description !== 'string') {
            return { error: 'Description must be text' };
        }
        data.description = body.description;
    }

    if (body.priority !== undefined) {
        if (!PRIORITIES.includes(body.priority)) {
            return { error: `Priority must be one of: ${PRIORITIES.join(', ')}` };
        }
        data.priority = body.priority;
    }

    if (body.status !== undefined) {
        if (!STATUSES.includes(body.status)) {
            return { error: `Status must be one of: ${STATUSES.join(', ')}` };
        }
        data.status = body.status;
    }

    if (body.due_date !== undefined) {
        if (body.due_date === null || body.due_date === '') {
            data.due_date = null;
        } else if (
            typeof body.due_date !== 'string' ||
            !DATE_RE.test(body.due_date) ||
            Number.isNaN(Date.parse(body.due_date))
        ) {
            return { error: 'Due date must be in YYYY-MM-DD format' };
        } else {
            data.due_date = body.due_date;
        }
    }

    return { data };
}

function findTask(id, userId) {
    return db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
}

router.get('/', (req, res) => {
    const tasks = db
        .prepare(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date IS NULL, due_date, id'
        )
        .all(req.userId);
    res.json({ tasks });
});

router.get('/:id', (req, res) => {
    const task = findTask(req.params.id, req.userId);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ task });
});

router.post('/', (req, res) => {
    const { data, error } = validateTask(req.body || {});
    if (error) {
        return res.status(400).json({ error });
    }

    const info = db
        .prepare(
            `INSERT INTO tasks (user_id, title, description, priority, due_date, status)
             VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
            req.userId,
            data.title,
            data.description ?? '',
            data.priority ?? 'medium',
            data.due_date ?? null,
            data.status ?? 'todo'
        );

    res.status(201).json({ task: findTask(info.lastInsertRowid, req.userId) });
});

router.put('/:id', (req, res) => {
    if (!findTask(req.params.id, req.userId)) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const { data, error } = validateTask(req.body || {}, { partial: true });
    if (error) {
        return res.status(400).json({ error });
    }

    const fields = Object.keys(data);
    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Field names come from validateTask, never directly from the request.
    const assignments = fields.map((field) => `${field} = @${field}`).join(', ');
    db.prepare(
        `UPDATE tasks SET ${assignments}, updated_at = CURRENT_TIMESTAMP
         WHERE id = @id AND user_id = @userId`
    ).run({ ...data, id: req.params.id, userId: req.userId });

    res.json({ task: findTask(req.params.id, req.userId) });
});

router.delete('/:id', (req, res) => {
    const info = db
        .prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
        .run(req.params.id, req.userId);

    if (info.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).end();
});

module.exports = router;
