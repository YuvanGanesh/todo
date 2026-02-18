import { db } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

const TASKS_COLLECTION = 'tasks';

export async function addTask(userId, { title, description }) {
    return addDoc(collection(db, TASKS_COLLECTION), {
        title,
        description,
        completed: false,
        userId,
        createdAt: serverTimestamp()
    });
}

export async function updateTask(taskId, updates) {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    return updateDoc(taskRef, updates);
}

export async function deleteTask(taskId) {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    return deleteDoc(taskRef);
}

export function subscribeTasks(userId, callback) {
    const q = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(tasks);
    });
}
