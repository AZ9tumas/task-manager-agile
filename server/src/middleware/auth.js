const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: 'Please log in first' });
    }

    const token = header.split(' ')[1];

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = data.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = auth;
