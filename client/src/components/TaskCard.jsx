function formatDate(date) {
    const [year, month, day] = date.split('-');
    return month + '-' + day + '-' + year;
}

function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
    return (
        <div className="box task">
            <div className="task-top">
                <h4>{task.title}</h4>
                <span className={'priority ' + task.priority}>{task.priority}</span>
            </div>

            {task.description && <p className="task-desc">{task.description}</p>}
            {task.due_date && <p className="task-date">Due: {formatDate(task.due_date)}</p>}

            <div className="task-buttons">
                <select value={task.status} onChange={(e) => onStatusChange(task, e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <button className="btn-small" onClick={() => onEdit(task)}>
                    Edit
                </button>
                <button className="btn-small red" onClick={() => onDelete(task)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskCard;
