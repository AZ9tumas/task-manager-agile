const request = require('supertest');
const app = require('../src/app');

describe('Auth', () => {
    test('user can sign up', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Alice', email: 'alice@test.com', password: 'secret123' });

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.name).toBe('Alice');
    });

    test('cannot sign up twice with the same email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Alice', email: 'alice@test.com', password: 'secret123' });

        expect(res.status).toBe(400);
    });

    test('cannot sign up with a short password', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Bob', email: 'bob@test.com', password: '123' });

        expect(res.status).toBe(400);
    });

    test('user can log in', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'alice@test.com', password: 'secret123' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('cannot log in with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'alice@test.com', password: 'wrongpass' });

        expect(res.status).toBe(401);
    });

    test('cannot get user without token', async () => {
        const res = await request(app).get('/api/auth/me');

        expect(res.status).toBe(401);
    });
});
