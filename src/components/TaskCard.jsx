import { useState } from 'react';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    function handleDelete() {
        if (confirmDelete) {
            onDelete(task.id);
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    }

    return (
        <div className={`task-card ${task.completed ? 'task-completed' : ''}`}>
            <div className="task-card-header">
                <label className="task-checkbox-label">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id, task.completed)}
                        className="task-checkbox"
                    />
                    <span className="checkmark"></span>
                </label>
                <div className="task-content">
                    <h3 className={`task-title ${task.completed ? 'completed-text' : ''}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`task-description ${task.completed ? 'completed-text' : ''}`}>
                            {task.description}
                        </p>
                    )}
                </div>
            </div>
            <div className="task-actions">
                <button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                >
                    ✏️
                </button>
                <button
                    className={`btn-icon btn-delete ${confirmDelete ? 'confirm-delete' : ''}`}
                    onClick={handleDelete}
                    title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
                >
                    {confirmDelete ? '⚠️ Sure?' : '🗑️'}
                </button>
            </div>
        </div>
    );
}
