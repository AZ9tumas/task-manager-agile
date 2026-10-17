import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { STATUSES } from '../constants.js';
import TaskCard from './TaskCard.jsx';
import TaskForm from './TaskForm.jsx';

export default function Board({ onUnauthorized }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // null = form closed, 'new' = creating, otherwise the task being edited
    const [editing, setEditing] = useState(null);

    function handleError(err) {
        if (err.status === 401) {
            onUnauthorized();
        } else {
            setError(err.message);
        }
    }

    useEffect(() => {
        api
            .listTasks()
            .then(({ tasks }) => setTasks(tasks))
            .catch(handleError)
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function replaceTask(updated) {
        setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)));
    }

    // Errors here are shown inside the form, so they are re-thrown.
    async function saveTask(values) {
        if (editing === 'new') {
            const { task } = await api.createTask(values);
            setTasks((current) => [...current, task]);
        } else {
            const { task } = await api.updateTask(editing.id, values);
            replaceTask(task);
        }
        setEditing(null);
    }

    async function moveTask(task, status) {
        setError('');
        try {
            const { task: updated } = await api.updateTask(task.id, { status });
            replaceTask(updated);
        } catch (err) {
            handleError(err);
        }
    }

    async function deleteTask(task) {
        if (!window.confirm(`Delete "${task.title}"?`)) return;
        setError('');
        try {
            await api.deleteTask(task.id);
            setTasks((current) => current.filter((t) => t.id !== task.id));
        } catch (err) {
            handleError(err);
        }
    }

    if (loading) {
        return <p className="centered">Loading tasks…</p>;
    }

    return (
        <main className="board-page">
            <div className="board-toolbar">
                <h2>Board</h2>
                <button className="button" onClick={() => setEditing('new')}>
                    + New task
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="board">
                {STATUSES.map((column, index) => {
                    const columnTasks = tasks.filter((t) => t.status === column.value);
                    return (
                        <section key={column.value} className="column">
                            <h3 className="column__title">
                                {column.label} <span className="column__count">{columnTasks.length}</span>
                            </h3>
                            {columnTasks.length === 0 && <p className="column__empty">No tasks</p>}
                            {columnTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onMoveLeft={index > 0 ? () => moveTask(task, STATUSES[index - 1].value) : null}
                                    onMoveRight={
                                        index < STATUSES.length - 1
                                            ? () => moveTask(task, STATUSES[index + 1].value)
                                            : null
                                    }
                                    onEdit={() => setEditing(task)}
                                    onDelete={() => deleteTask(task)}
                                />
                            ))}
                        </section>
                    );
                })}
            </div>

            {editing && (
                <TaskForm
                    task={editing === 'new' ? null : editing}
                    onSave={saveTask}
                    onCancel={() => setEditing(null)}
                />
            )}
        </main>
    );
}
