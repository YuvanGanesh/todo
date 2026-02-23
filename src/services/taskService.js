import { realtimeDb } from '../firebase';
import {
    ref,
    push,
    set,
    update,
    remove,
    onValue,
    query,
    orderByChild,
    equalTo
} from 'firebase/database';

const TASKS_PATH = 'tasks';

// ── Task CRUD ──────────────────────────────────────────

export async function addTask(userId, { title, description, notes, deadline }) {
    const tasksRef = ref(realtimeDb, TASKS_PATH);
    const newTaskRef = push(tasksRef);
    return set(newTaskRef, {
        title,
        description: description || '',
        notes: notes || '',
        deadline: deadline || null,
        completed: false,
        userId,
        createdAt: new Date().toISOString()
    });
}

export async function updateTask(taskId, updates) {
    const taskRef = ref(realtimeDb, `${TASKS_PATH}/${taskId}`);
    return update(taskRef, updates);
}

export async function deleteTask(taskId) {
    const taskRef = ref(realtimeDb, `${TASKS_PATH}/${taskId}`);
    return remove(taskRef);
}

export function subscribeTasks(userId, callback) {
    const tasksRef = ref(realtimeDb, TASKS_PATH);

    const unsubscribe = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            callback([]);
            return;
        }
        const tasks = Object.entries(data)
            .filter(([, task]) => task.userId === userId)
            .map(([id, task]) => {
                // Convert subtasks object to array
                const subtasks = task.subtasks
                    ? Object.entries(task.subtasks).map(([subId, sub]) => ({
                        id: subId,
                        ...sub
                    }))
                    : [];
                return { id, ...task, subtasks };
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(tasks);
    });

    return unsubscribe;
}

// ── Notes ──────────────────────────────────────────────

export async function updateTaskNotes(taskId, notes) {
    const taskRef = ref(realtimeDb, `${TASKS_PATH}/${taskId}`);
    return update(taskRef, { notes });
}

// ── Subtask CRUD ───────────────────────────────────────

export async function addSubTask(taskId, { title }) {
    const subtasksRef = ref(realtimeDb, `${TASKS_PATH}/${taskId}/subtasks`);
    const newRef = push(subtasksRef);
    return set(newRef, {
        title,
        completed: false,
        createdAt: new Date().toISOString()
    });
}

export async function updateSubTask(taskId, subtaskId, updates) {
    const subRef = ref(
        realtimeDb,
        `${TASKS_PATH}/${taskId}/subtasks/${subtaskId}`
    );
    return update(subRef, updates);
}

export async function deleteSubTask(taskId, subtaskId) {
    const subRef = ref(
        realtimeDb,
        `${TASKS_PATH}/${taskId}/subtasks/${subtaskId}`
    );
    return remove(subRef);
}
