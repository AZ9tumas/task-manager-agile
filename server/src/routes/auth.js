const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function issueToken(user) {
    return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
    return { id: user.id, name: user.name, email: user.email };
}

router.post('/register', (req, res) => {
    const { name, email, password } = req.body || {};

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
        return res.status(400).json({ error: 'A valid email is required' });
    }
    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
        return res
            .status(400)
            .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const info = db
        .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
        .run(name.trim(), normalizedEmail, passwordHash);

    const user = { id: info.lastInsertRowid, name: name.trim(), email: normalizedEmail };
    res.status(201).json({ token: issueToken(user), user });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email.trim().toLowerCase());

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ token: issueToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.userId);
    if (!user) {
        return res.status(401).json({ error: 'User no longer exists' });
    }
    res.json({ user });
});

module.exports = router;
