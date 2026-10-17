const TOKEN_KEY = 'token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

async function request(path, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`/api${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (res.status === 204) {
        return null;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const error = new Error(data.error || `Request failed (${res.status})`);
        error.status = res.status;
        throw error;
    }
    return data;
}

export const api = {
    register: (details) => request('/auth/register', { method: 'POST', body: details }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    me: () => request('/auth/me'),

    listTasks: () => request('/tasks'),
    createTask: (task) => request('/tasks', { method: 'POST', body: task }),
    updateTask: (id, changes) => request(`/tasks/${id}`, { method: 'PUT', body: changes }),
    deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
