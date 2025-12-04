import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    query, 
    where, 
    orderBy,
    deleteDoc,
    doc,
    addDoc, 
    serverTimestamp,
} from 'firebase/firestore';
// Removed imports for getStorage, ref, uploadBytes, getDownloadURL, deleteObject
import { firebase_app as app } from '../utils/firebaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system'; // New import for local file deletion

const db = getFirestore(app);

const VOICE_NOTES_KEY = '@VoiceNotes_'; // Prefix for AsyncStorage key

// --- UTILITY FUNCTIONS ---

// Function to fetch all local voice notes for the current user
const getLocalVoiceNotes = async (userId) => {
    try {
        const jsonValue = await AsyncStorage.getItem(VOICE_NOTES_KEY + userId);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Failed to fetch local voice notes:", e);
        return [];
    }
};

// --- FIRESTORE / TEXT NOTES (Remains unchanged) ---

export const subscribeToTextNotes = (userId, callback, loadingSetter) => {
    const textNotesQuery = query(
        collection(db, "notes"), 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(textNotesQuery, (snapshot) => {
        const notes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(notes);
        loadingSetter(false);
    }, (error) => {
        console.error("Error fetching text notes: ", error);
        loadingSetter(false);
    });
};

export const deleteTextNote = async (noteId) => {
    await deleteDoc(doc(db, "notes", noteId));
};

// --- LOCAL VOICE NOTE IMPLEMENTATION ---

// Mimics onSnapshot by polling AsyncStorage (called in useEffect)
export const subscribeToLocalVoiceNotes = (userId, callback, loadingSetter) => {
    const pollInterval = 1000; // Check local storage every 1 second
    
    const pollData = async () => {
        const notes = await getLocalVoiceNotes(userId);
        callback(notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        loadingSetter(false);
    };

    pollData();
    const intervalId = setInterval(pollData, pollInterval);

    return () => clearInterval(intervalId); // Cleanup function
};

export const saveLocalAudioFile = async (uri, userId) => {
    const newNote = {
        id: Date.now().toString(),
        userId: userId,
        uri: uri, // The local file path
        createdAt: new Date().toISOString(),
    };

    const existingNotes = await getLocalVoiceNotes(userId);
    existingNotes.push(newNote);
    
    const jsonValue = JSON.stringify(existingNotes);
    await AsyncStorage.setItem(VOICE_NOTES_KEY + userId, jsonValue);
};

export const deleteLocalVoiceNote = async (noteId, uri) => {
    const userId = (await getLocalVoiceNotes()).find(n => n.id === noteId)?.userId;
    if (!userId) return; // Should not happen if item exists

    // 1. Delete the actual file from the file system
    try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (e) {
        console.warn("Failed to delete physical file:", e);
    }

    // 2. Delete the metadata from AsyncStorage
    const existingNotes = await getLocalVoiceNotes(userId);
    const updatedNotes = existingNotes.filter(note => note.id !== noteId);
    
    const jsonValue = JSON.stringify(updatedNotes);
    await AsyncStorage.setItem(VOICE_NOTES_KEY + userId, jsonValue);
};