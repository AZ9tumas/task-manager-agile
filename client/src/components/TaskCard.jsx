export default function TaskCard({ task, onMoveLeft, onMoveRight, onEdit, onDelete }) {
    return (
        <article className="card task-card">
            <div className="task-card__header">
                <h4 className="task-card__title">{task.title}</h4>
                <span className={`badge badge--${task.priority}`}>{task.priority}</span>
            </div>

            {task.description && <p className="task-card__description">{task.description}</p>}
            {task.due_date && <p className="task-card__due">Due {task.due_date}</p>}

            <div className="task-card__actions">
                <button
                    className="icon-button"
                    onClick={onMoveLeft}
                    disabled={!onMoveLeft}
                    aria-label="Move to previous column"
                    title="Move left"
                >
                    ←
                </button>
                <button
                    className="icon-button"
                    onClick={onMoveRight}
                    disabled={!onMoveRight}
                    aria-label="Move to next column"
                    title="Move right"
                >
                    →
                </button>
                <span className="spacer" />
                <button className="link-button" onClick={onEdit}>
                    Edit
                </button>
                <button className="link-button link-button--danger" onClick={onDelete}>
                    Delete
                </button>
            </div>
        </article>
    );
}
