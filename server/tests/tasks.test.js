const request = require('supertest');
const app = require('../src/app');

let token;
let otherToken;
let taskId;

beforeAll(async () => {
    const res1 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User One', email: 'one@test.com', password: 'secret123' });
    token = res1.body.token;

    const res2 = await request(app)
        .post('/api/auth/register')
        .send({ name: 'User Two', email: 'two@test.com', password: 'secret123' });
    otherToken = res2.body.token;
});

describe('Tasks', () => {
    test('cannot get tasks without logging in', async () => {
        const res = await request(app).get('/api/tasks');

        expect(res.status).toBe(401);
    });

    test('user can add a task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'Write SRS', priority: 'high', due_date: '2026-11-01' });

        expect(res.status).toBe(201);
        expect(res.body.task.title).toBe('Write SRS');
        expect(res.body.task.status).toBe('todo');
        taskId = res.body.task.id;
    });

    test('cannot add a task without a title', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', 'Bearer ' + token)
            .send({ description: 'no title' });

        expect(res.status).toBe(400);
    });

    test('cannot add a task with a wrong priority', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'Test', priority: 'urgent' });

        expect(res.status).toBe(400);
    });

    test('cannot add a task with a wrong due date', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'Test', due_date: '2026-13-45' });

        expect(res.status).toBe(400);
    });

    test('user can see their tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', 'Bearer ' + token);

        expect(res.status).toBe(200);
        expect(res.body.tasks.length).toBe(1);
    });

    test('user can move a task to done', async () => {
        const res = await request(app)
            .put('/api/tasks/' + taskId)
            .set('Authorization', 'Bearer ' + token)
            .send({ status: 'done' });

        expect(res.status).toBe(200);
        expect(res.body.task.status).toBe('done');
        expect(res.body.task.title).toBe('Write SRS');
    });

    test('other user cannot see or delete the task', async () => {
        const list = await request(app)
            .get('/api/tasks')
            .set('Authorization', 'Bearer ' + otherToken);
        const del = await request(app)
            .delete('/api/tasks/' + taskId)
            .set('Authorization', 'Bearer ' + otherToken);

        expect(list.body.tasks.length).toBe(0);
        expect(del.status).toBe(404);
    });

    test('user can delete a task', async () => {
        const res = await request(app)
            .delete('/api/tasks/' + taskId)
            .set('Authorization', 'Bearer ' + token);

        expect(res.status).toBe(200);

        const list = await request(app)
            .get('/api/tasks')
            .set('Authorization', 'Bearer ' + token);
        expect(list.body.tasks.length).toBe(0);
    });
});
