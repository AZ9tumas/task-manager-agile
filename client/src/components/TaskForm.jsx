import { useState } from 'react';
import { PRIORITIES, STATUSES } from '../constants.js';

const EMPTY_TASK = {
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    status: 'todo',
};

export default function TaskForm({ task, onSave, onCancel }) {
    const [form, setForm] = useState(() =>
        task
            ? {
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    due_date: task.due_date ?? '',
                    status: task.status,
                }
            : EMPTY_TASK
    );
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function updateField(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onSave({ ...form, due_date: form.due_date || null });
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    }

    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <form
                className="card modal"
                onSubmit={handleSubmit}
                onClick={(event) => event.stopPropagation()}
            >
                <h2>{task ? 'Edit task' : 'New task'}</h2>

                <label>
                    Title
                    <input
                        name="title"
                        value={form.title}
                        onChange={updateField}
                        maxLength={200}
                        required
                        autoFocus
                    />
                </label>

                <label>
                    Description
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={updateField}
                        rows={3}
                    />
                </label>

                <div className="form-row">
                    <label>
                        Priority
                        <select name="priority" value={form.priority} onChange={updateField}>
                            {PRIORITIES.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Status
                        <select name="status" value={form.status} onChange={updateField}>
                            {STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Due date
                        <input name="due_date" type="date" value={form.due_date} onChange={updateField} />
                    </label>
                </div>

                {error && <p className="error">{error}</p>}

                <div className="modal__actions">
                    <button type="button" className="button button--secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="button" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
