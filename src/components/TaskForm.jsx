import { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, initialData, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
        }
    }, [initialData]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), description: description.trim() });
        if (!isEditing) {
            setTitle('');
            setDescription('');
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
            <div className="task-form-actions">
                <button type="submit" className="primary-btn">
                    {isEditing ? '💾 Save' : '➕ Add Task'}
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
