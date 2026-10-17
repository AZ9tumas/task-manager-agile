const request = require('supertest');
const app = require('../src/app');

async function registerAndGetToken(email) {
    const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email, password: 'secret123' });
    return res.body.token;
}

describe('Tasks API', () => {
    let token;
    let otherToken;
    let taskId;

    const auth = (t = token) => ({ Authorization: `Bearer ${t}` });

    beforeAll(async () => {
        token = await registerAndGetToken('owner@example.com');
        otherToken = await registerAndGetToken('other@example.com');
    });

    test('requires authentication', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.status).toBe(401);
    });

    test('creates a task with defaults', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set(auth())
            .send({ title: '  Write SRS  ' });

        expect(res.status).toBe(201);
        expect(res.body.task).toMatchObject({
            title: 'Write SRS',
            description: '',
            priority: 'medium',
            status: 'todo',
            due_date: null,
        });
        taskId = res.body.task.id;
    });

    test('creates a task with all fields', async () => {
        const res = await request(app).post('/api/tasks').set(auth()).send({
            title: 'Draw ER diagram',
            description: 'Users and tasks tables',
            priority: 'high',
            due_date: '2026-11-01',
            status: 'in_progress',
        });

        expect(res.status).toBe(201);
        expect(res.body.task).toMatchObject({ priority: 'high', status: 'in_progress' });
    });

    test.each([
        [{}, 'missing title'],
        [{ title: '   ' }, 'blank title'],
        [{ title: 'x'.repeat(201) }, 'title too long'],
        [{ title: 'Task', priority: 'urgent' }, 'bad priority'],
        [{ title: 'Task', status: 'blocked' }, 'bad status'],
        [{ title: 'Task', due_date: '01/11/2026' }, 'bad date format'],
    ])('rejects invalid input (%#: %s)', async (body) => {
        const res = await request(app).post('/api/tasks').set(auth()).send(body);
        expect(res.status).toBe(400);
        expect(res.body.error).toEqual(expect.any(String));
    });

    test('lists only the current user\'s tasks', async () => {
        const mine = await request(app).get('/api/tasks').set(auth());
        const theirs = await request(app).get('/api/tasks').set(auth(otherToken));

        expect(mine.status).toBe(200);
        expect(mine.body.tasks).toHaveLength(2);
        expect(theirs.body.tasks).toHaveLength(0);
    });

    test('updates a task\'s status', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set(auth())
            .send({ status: 'done' });

        expect(res.status).toBe(200);
        expect(res.body.task.status).toBe('done');
        expect(res.body.task.title).toBe('Write SRS');
    });

    test('rejects an update with no fields', async () => {
        const res = await request(app).put(`/api/tasks/${taskId}`).set(auth()).send({});
        expect(res.status).toBe(400);
    });

    test('does not let another user read, edit or delete the task', async () => {
        const read = await request(app).get(`/api/tasks/${taskId}`).set(auth(otherToken));
        const edit = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set(auth(otherToken))
            .send({ title: 'Hijacked' });
        const del = await request(app).delete(`/api/tasks/${taskId}`).set(auth(otherToken));

        expect(read.status).toBe(404);
        expect(edit.status).toBe(404);
        expect(del.status).toBe(404);
    });

    test('deletes a task', async () => {
        const del = await request(app).delete(`/api/tasks/${taskId}`).set(auth());
        const after = await request(app).get(`/api/tasks/${taskId}`).set(auth());

        expect(del.status).toBe(204);
        expect(after.status).toBe(404);
    });
});
