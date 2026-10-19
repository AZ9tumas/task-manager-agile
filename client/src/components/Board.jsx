import { useEffect, useState } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../api.js';
import TaskCard from './TaskCard.jsx';
import TaskForm from './TaskForm.jsx';

const columns = [
    { status: 'todo', title: 'To Do' },
    { status: 'in_progress', title: 'In Progress' },
    { status: 'done', title: 'Done' },
];

function Board() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        getTasks()
            .then((data) => setTasks(data.tasks))
            .catch((err) => setError(err.message));
    }, []);

    function openNewForm() {
        setEditingTask(null);
        setShowForm(true);
    }

    function openEditForm(task) {
        setEditingTask(task);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingTask(null);
    }

    async function handleSave(form) {
        if (editingTask) {
            const data = await updateTask(editingTask.id, form);
            setTasks(tasks.map((t) => (t.id === editingTask.id ? data.task : t)));
        } else {
            const data = await addTask(form);
            setTasks([...tasks, data.task]);
        }
        closeForm();
    }

    async function handleStatusChange(task, status) {
        try {
            const data = await updateTask(task.id, { status: status });
            setTasks(tasks.map((t) => (t.id === task.id ? data.task : t)));
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete(task) {
        if (!window.confirm('Delete "' + task.title + '"?')) {
            return;
        }

        try {
            await deleteTask(task.id);
            setTasks(tasks.filter((t) => t.id !== task.id));
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="board-page">
            <div className="board-top">
                <h2>My Board</h2>
                <button className="btn" onClick={openNewForm}>
                    + Add Task
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="board">
                {columns.map((column) => {
                    const columnTasks = tasks.filter((t) => t.status === column.status);

                    return (
                        <div key={column.status} className="column">
                            <h3>
                                {column.title} ({columnTasks.length})
                            </h3>

                            {columnTasks.length === 0 && <p className="empty">No tasks</p>}

                            {columnTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusChange={handleStatusChange}
                                    onEdit={openEditForm}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>

            {showForm && <TaskForm task={editingTask} onSave={handleSave} onCancel={closeForm} />}
        </div>
    );
}

export default Board;
