const request = require('supertest');
const app = require('../src/app');

const user = { name: 'Alice', email: 'alice@example.com', password: 'secret123' };

describe('Auth API', () => {
    test('registers a new user and returns a token', async () => {
        const res = await request(app).post('/api/auth/register').send(user);

        expect(res.status).toBe(201);
        expect(res.body.token).toEqual(expect.any(String));
        expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
        expect(res.body.user.password_hash).toBeUndefined();
    });

    test('rejects a duplicate email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ ...user, email: 'ALICE@example.com' });

        expect(res.status).toBe(409);
    });

    test('rejects invalid registration input', async () => {
        const badEmail = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Bob', email: 'not-an-email', password: 'secret123' });
        const shortPassword = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Bob', email: 'bob@example.com', password: '123' });
        const noName = await request(app)
            .post('/api/auth/register')
            .send({ email: 'bob@example.com', password: 'secret123' });

        expect(badEmail.status).toBe(400);
        expect(shortPassword.status).toBe(400);
        expect(noName.status).toBe(400);
    });

    test('logs in with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: user.email, password: user.password });

        expect(res.status).toBe(200);
        expect(res.body.token).toEqual(expect.any(String));
    });

    test('rejects a wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: user.email, password: 'wrong-password' });

        expect(res.status).toBe(401);
    });

    test('returns the current user for a valid token', async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({ email: user.email, password: user.password });

        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${login.body.token}`);

        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe(user.email);
    });

    test('rejects requests without a valid token', async () => {
        const missing = await request(app).get('/api/auth/me');
        const invalid = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer not-a-real-token');

        expect(missing.status).toBe(401);
        expect(invalid.status).toBe(401);
    });
});
