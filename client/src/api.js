async function request(url, method, body) {
    const token = localStorage.getItem('token');

    const res = await fetch('/api' + url, {
        method: method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? 'Bearer ' + token : '',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
}

export function register(name, email, password) {
    return request('/auth/register', 'POST', { name, email, password });
}

export function login(email, password) {
    return request('/auth/login', 'POST', { email, password });
}

export function getMe() {
    return request('/auth/me');
}

export function getTasks() {
    return request('/tasks');
}

export function addTask(task) {
    return request('/tasks', 'POST', task);
}

export function updateTask(id, task) {
    return request('/tasks/' + id, 'PUT', task);
}

export function deleteTask(id) {
    return request('/tasks/' + id, 'DELETE');
}
