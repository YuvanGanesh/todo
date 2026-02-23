import { useState } from 'react';
import {
    addSubTask,
    updateSubTask,
    deleteSubTask,
    updateTaskNotes
} from '../services/taskService';

export default function SubTaskList({ task }) {
    const [newSubTitle, setNewSubTitle] = useState('');
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesValue, setNotesValue] = useState(task.notes || '');

    async function handleAddSub(e) {
        e.preventDefault();
        if (!newSubTitle.trim()) return;
        await addSubTask(task.id, { title: newSubTitle.trim() });
        setNewSubTitle('');
    }

    async function handleToggleSub(subId, currentCompleted) {
        await updateSubTask(task.id, subId, { completed: !currentCompleted });
    }

    async function handleDeleteSub(subId) {
        await deleteSubTask(task.id, subId);
    }

    async function handleSaveNotes() {
        await updateTaskNotes(task.id, notesValue);
        setIsEditingNotes(false);
    }

    const subtasks = task.subtasks || [];
    const completedCount = subtasks.filter((s) => s.completed).length;

    return (
        <div className="subtask-section">
            {/* ── Notes ─────────────────────────────── */}
            <div className="notes-section">
                <div className="notes-header">
                    <span className="notes-label">📝 Notes</span>
                    {!isEditingNotes ? (
                        <button
                            className="btn-inline"
                            onClick={() => {
                                setNotesValue(task.notes || '');
                                setIsEditingNotes(true);
                            }}
                        >
                            {task.notes ? 'Edit' : 'Add Note'}
                        </button>
                    ) : (
                        <div className="notes-actions">
                            <button className="btn-inline btn-save" onClick={handleSaveNotes}>
                                Save
                            </button>
                            <button
                                className="btn-inline"
                                onClick={() => setIsEditingNotes(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                {isEditingNotes ? (
                    <textarea
                        className="notes-textarea"
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        placeholder="Write your notes here..."
                        rows={3}
                    />
                ) : (
                    task.notes && <p className="notes-display">{task.notes}</p>
                )}
            </div>

            {/* ── Subtasks ──────────────────────────── */}
            <div className="subtask-list-container">
                <div className="subtask-header">
                    <span className="subtask-label">
                        ✅ Subtasks{' '}
                        {subtasks.length > 0 && (
                            <span className="subtask-progress">
                                {completedCount}/{subtasks.length}
                            </span>
                        )}
                    </span>
                </div>

                {subtasks.length > 0 && (
                    <div className="subtask-progress-bar">
                        <div
                            className="subtask-progress-fill"
                            style={{
                                width:
                                    subtasks.length > 0
                                        ? `${(completedCount / subtasks.length) * 100}%`
                                        : '0%'
                            }}
                        />
                    </div>
                )}

                <ul className="subtask-list">
                    {subtasks.map((sub) => (
                        <li key={sub.id} className={`subtask-item ${sub.completed ? 'sub-done' : ''}`}>
                            <label className="subtask-check-label">
                                <input
                                    type="checkbox"
                                    checked={sub.completed}
                                    onChange={() => handleToggleSub(sub.id, sub.completed)}
                                    className="subtask-checkbox"
                                />
                                <span className="subtask-checkmark"></span>
                                <span className={`subtask-title ${sub.completed ? 'completed-text' : ''}`}>
                                    {sub.title}
                                </span>
                            </label>
                            <button
                                className="btn-sub-delete"
                                onClick={() => handleDeleteSub(sub.id)}
                                title="Remove subtask"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>

                <form className="subtask-add-form" onSubmit={handleAddSub}>
                    <input
                        type="text"
                        className="subtask-input"
                        placeholder="Add a subtask..."
                        value={newSubTitle}
                        onChange={(e) => setNewSubTitle(e.target.value)}
                    />
                    <button type="submit" className="btn-add-sub" disabled={!newSubTitle.trim()}>
                        +
                    </button>
                </form>
            </div>
        </div>
    );
}
