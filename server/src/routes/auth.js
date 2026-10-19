const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

function makeToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
        return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const result = db
        .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
        .run(name, email, hashed);

    const user = { id: result.lastInsertRowid, name: name, email: email };
    res.status(201).json({ token: makeToken(user.id), user: user });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Wrong email or password' });
    }

    res.json({
        token: makeToken(user.id),
        user: { id: user.id, name: user.name, email: user.email },
    });
});

router.get('/me', auth, (req, res) => {
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user });
});

module.exports = router;
