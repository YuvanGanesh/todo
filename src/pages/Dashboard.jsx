import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addTask, updateTask, deleteTask, subscribeTasks } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeTasks(currentUser.uid, (tasksData) => {
            setTasks(tasksData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
    });

    async function handleAddTask({ title, description }) {
        try {
            setError('');
            await addTask(currentUser.uid, { title, description });
        } catch (err) {
            setError('Failed to add task: ' + err.message);
        }
    }

    async function handleToggle(taskId, currentCompleted) {
        try {
            setError('');
            await updateTask(taskId, { completed: !currentCompleted });
        } catch (err) {
            setError('Failed to update task: ' + err.message);
        }
    }

    async function handleEdit(task) {
        setEditingTask(task);
    }

    async function handleEditSubmit({ title, description }) {
        try {
            setError('');
            await updateTask(editingTask.id, { title, description });
            setEditingTask(null);
        } catch (err) {
            setError('Failed to update task: ' + err.message);
        }
    }

    async function handleDelete(taskId) {
        try {
            setError('');
            await deleteTask(taskId);
        } catch (err) {
            setError('Failed to delete task: ' + err.message);
        }
    }

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <div className="dashboard">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <h1 className="navbar-title">Task Manager</h1>
                </div>
                <div className="navbar-right">
                    <span className="navbar-user">{currentUser.displayName || currentUser.email}</span>
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-container">
                    {/* Add / Edit Task Form */}
                    <section className="task-form-section">
                        <h2 className="section-title">
                            {editingTask ? ' Edit Task' : 'New Task'}
                        </h2>
                        <TaskForm
                            onSubmit={editingTask ? handleEditSubmit : handleAddTask}
                            initialData={editingTask}
                            onCancel={() => setEditingTask(null)}
                        />
                    </section>

                    {/* Error */}
                    {error && <div className="error-msg">{error}</div>}

                    {/* Task List */}
                    <section className="task-list-section">
                        <h2 className="section-title">
                             Your Tasks
                            {tasks.length > 0 && (
                                <span className="task-count">
                                    {tasks.filter((t) => !t.completed).length} remaining
                                </span>
                            )}
                        </h2>

                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p>Loading tasks...</p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="empty-state">
                                <h3>No tasks yet!</h3>
                                <p>Add your first task above to get started.</p>
                            </div>
                        ) : (
                            <div className="task-list">
                                {sortedTasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onToggle={handleToggle}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
