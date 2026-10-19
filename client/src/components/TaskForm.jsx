import { useState } from 'react';

function toFormDate(date) {
    const [year, month, day] = date.split('-');
    return month + '-' + day + '-' + year;
}

function toSaveDate(date) {
    const [month, day, year] = date.split('-');
    return year + '-' + month + '-' + day;
}

function TaskForm({ task, onSave, onCancel }) {
    const [title, setTitle] = useState(task ? task.title : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [priority, setPriority] = useState(task ? task.priority : 'medium');
    const [status, setStatus] = useState(task ? task.status : 'todo');
    const [dueDate, setDueDate] = useState(task && task.due_date ? toFormDate(task.due_date) : '');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (dueDate && !/^\d{2}-\d{2}-\d{4}$/.test(dueDate)) {
            setError('Due date must be in MM-DD-YYYY format');
            return;
        }

        try {
            await onSave({
                title: title,
                description: description,
                priority: priority,
                status: status,
                due_date: dueDate ? toSaveDate(dueDate) : null,
            });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="overlay">
            <form className="box form" onSubmit={handleSubmit}>
                <h2>{task ? 'Edit Task' : 'New Task'}</h2>

                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>Description</label>
                <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <label>Due Date</label>
                <input
                    placeholder="MM-DD-YYYY"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                {error && <p className="error">{error}</p>}

                <div className="form-buttons">
                    <button type="button" className="btn btn-grey" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;
