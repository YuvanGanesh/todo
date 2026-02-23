import { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, initialData, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [deadlineTime, setDeadlineTime] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setNotes(initialData.notes || '');
            // Split existing deadline into date and time parts
            if (initialData.deadline) {
                const [datePart, timePart] = initialData.deadline.split('T');
                setDeadlineDate(datePart || '');
                setDeadlineTime(timePart || '');
            } else {
                setDeadlineDate('');
                setDeadlineTime('');
            }
        } else {
            setTitle('');
            setDescription('');
            setNotes('');
            setDeadlineDate('');
            setDeadlineTime('');
        }
    }, [initialData]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;

        // Combine date and time into ISO-like string if both provided
        let deadline = null;
        if (deadlineDate) {
            deadline = deadlineTime
                ? `${deadlineDate}T${deadlineTime}`
                : `${deadlineDate}T23:59`;
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            notes: notes.trim(),
            deadline
        });
        if (!isEditing) {
            setTitle('');
            setDescription('');
            setNotes('');
            setDeadlineDate('');
            setDeadlineTime('');
        }
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-form-inputs">
                <input
                    type="text"
                    placeholder="Task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="task-input"
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="task-input"
                />
            </div>
            <div className="task-form-row">
                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="task-input task-notes-input"
                    rows={2}
                />
                <div className="deadline-pickers">
                    <div className="deadline-picker-item">
                        <label className="deadline-label" htmlFor="task-deadline-date">
                            <span className="deadline-icon">📅</span> Date
                        </label>
                        <input
                            id="task-deadline-date"
                            type="date"
                            value={deadlineDate}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            className="task-input deadline-input"
                        />
                    </div>
                    <div className="deadline-picker-item">
                        <label className="deadline-label" htmlFor="task-deadline-time">
                            <span className="deadline-icon">🕐</span> Time
                        </label>
                        <input
                            id="task-deadline-time"
                            type="time"
                            value={deadlineTime}
                            onChange={(e) => setDeadlineTime(e.target.value)}
                            className="task-input deadline-input"
                        />
                    </div>
                </div>
            </div>
            <div className="task-form-actions">
                <button type="submit" className="primary-btn">
                    {isEditing ? 'Save' : 'Add Task'}
                </button>
                {isEditing && (
                    <button type="button" className="secondary-btn" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
