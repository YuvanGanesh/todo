import { useState } from 'react';
import SubTaskList from './SubTaskList';

function formatDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) + ' at ' + d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function getRemainingTime(deadline) {
    if (!deadline) return null;
    const now = new Date();
    const dl = new Date(deadline);
    const diffMs = dl - now;

    if (diffMs <= 0) return { text: 'Overdue', urgency: 'overdue' };

    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
        const hours = Math.ceil(diffHours);
        return { text: `${hours}h remaining`, urgency: 'critical' };
    }
    if (diffDays <= 3) {
        return { text: `${diffDays}d remaining`, urgency: 'warning' };
    }
    return { text: `${diffDays}d remaining`, urgency: 'safe' };
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const remaining = getRemainingTime(task.deadline);
    const subtaskCount = (task.subtasks || []).length;
    const subtaskDone = (task.subtasks || []).filter((s) => s.completed).length;

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
                    <div className="task-meta">
                        {task.createdAt && (
                            <span className="task-created">
                                🕐 {formatDate(task.createdAt)}
                            </span>
                        )}
                        {task.deadline && (
                            <span className="task-deadline-display">
                                📅 Due: {formatDate(task.deadline)}
                            </span>
                        )}
                        {remaining && (
                            <span className={`task-countdown countdown-${remaining.urgency}`}>
                                ⏳ {remaining.text}
                            </span>
                        )}
                        {subtaskCount > 0 && (
                            <span className="task-subtask-badge">
                                ✅ {subtaskDone}/{subtaskCount} subtasks
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="task-actions">
                <button
                    className="btn-icon btn-expand"
                    onClick={() => setExpanded(!expanded)}
                    title={expanded ? 'Collapse' : 'Expand'}
                >
                    {expanded ? '▲' : '▼'}
                </button>
                <button
                    className="btn-icon btn-edit"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                >
                    Edit
                </button>
                <button
                    className={`btn-icon btn-delete ${confirmDelete ? 'confirm-delete' : ''}`}
                    onClick={handleDelete}
                    title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
                >
                    {confirmDelete ? 'Sure?' : 'Delete'}
                </button>
            </div>
            {expanded && (
                <div className="task-expanded-section">
                    <SubTaskList task={task} />
                </div>
            )}
        </div>
    );
}
