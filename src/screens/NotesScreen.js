import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    Platform,
    Image,
    Button,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert, // Added for confirmation dialogs
} from 'react-native';
import { Audio } from 'expo-av';
import { getAuth } from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    query, 
    where, 
    serverTimestamp, 
    orderBy,
    deleteDoc, // Imported for deleting Firestore documents
    doc, // Imported for referencing documents
    addDoc, 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // deleteObject added
import { app } from '../utils/firebaseConfig';

// --- Initialize Firebase Services ---
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Assumed colors object (copied from your previous context)
const colors = {
    background: '#EFE6DE',
    primary: '#e09a80', // Using the color from your previous context's FAB
    textPrimary: '#2c5c32ff',
    textSecondary: '#8a8a8aff',
    white: '#fff',
    headerText: '#2c5c32ff',
    card: '#fff',
    cardTitle: '#2c5c32ff',
    cardText: '#8a8a8aff',
    deleteButton: '#E53935', // Red color for delete action
};

// --- Reusable Text Note Card Component (Updated to handle Delete button) ---
const TextNoteCard = ({ title, date, iconName, cardText, onPress, onDeletePress }) => {
    const { MaterialCommunityIcons } = require('@expo/vector-icons');
    return (
        <TouchableOpacity style={styles.noteContainer} onPress={onPress}>
            <View style={styles.noteHeader}>
                <View style={styles.noteHeaderLeft}>
                    <Text style={styles.noteTitle}>{title}</Text>
                    <Text style={styles.noteDate}>{date}</Text>
                </View>
                <View style={styles.noteHeaderRight}>
                    <MaterialCommunityIcons name={iconName} size={24} color={colors.headerText} style={{ marginRight: 10 }} />
                    <TouchableOpacity onPress={onDeletePress} style={styles.deleteIconWrapper}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color={colors.deleteButton} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardText} numberOfLines={3}>{cardText}</Text>
            </View>
        </TouchableOpacity>
    );
};

// --- Main Component ---
export default function NotesScreen({ navigation }) {
    const currentUserId = auth.currentUser?.uid;

    // --- States for Voice Notes ---
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [voiceNotes, setVoiceNotes] = useState([]);
    const [isLoadingVoiceNotes, setIsLoadingVoiceNotes] = useState(true);
    const [currentSound, setCurrentSound] = useState(null);

    // --- States for Text Notes ---
    const [textNotes, setTextNotes] = useState([]);
    const [isLoadingTextNotes, setIsLoadingTextNotes] = useState(true);

    // --- UTILITY: Get Timestamp for Display ---
    const getTimestampDisplay = (firestoreTimestamp) => {
        if (!firestoreTimestamp) return 'Saving...';
        const date = firestoreTimestamp.toDate ? firestoreTimestamp.toDate() : new Date(firestoreTimestamp);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- 1. Fetch Voice Notes (Real-time Listener) ---
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setIsLoadingVoiceNotes(false);
            return;
        }

        const notesQuery = query(
            collection(db, "voiceNotes"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
            const notes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVoiceNotes(notes);
            setIsLoadingVoiceNotes(false);
        }, (error) => {
            console.error("Error fetching voice notes: ", error);
            setIsLoadingVoiceNotes(false);
        });

        return () => unsubscribe();
    }, [currentUserId]);

    // --- 2. Fetch Text Notes (Real-time Listener) ---
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setIsLoadingTextNotes(false);
            return;
        }

        const textNotesQuery = query(
            collection(db, "notes"), 
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribeText = onSnapshot(textNotesQuery, (snapshot) => {
            const notes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTextNotes(notes);
            setIsLoadingTextNotes(false);
        }, (error) => {
            console.error("Error fetching text notes: ", error);
            setIsLoadingTextNotes(false);
        });

        return () => unsubscribeText();
    }, [currentUserId]);

    // ----------------------------------------------------------------------
    // --- DELETION LOGIC ---
    // ----------------------------------------------------------------------

    const confirmAndDeleteTextNote = (noteId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to permanently delete this note?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteTextNote(noteId) },
            ]
        );
    };

    const confirmAndDeleteVoiceNote = (noteId, fileName) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to permanently delete this voice memo?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteVoiceNote(noteId, fileName) },
            ]
        );
    };

    async function deleteTextNote(noteId) {
        try {
            await deleteDoc(doc(db, "notes", noteId));
            // Deletion is reflected automatically by onSnapshot
        } catch (error) {
            console.error("Error deleting text note:", error);
            Alert.alert("Error", "Failed to delete the text note.");
        }
    }

    async function deleteVoiceNote(noteId, fileName) {
        try {
            // 1. Delete the file from Firebase Storage
            const storageRef = ref(storage, fileName);
            await deleteObject(storageRef);

            // 2. Delete the metadata document from Firestore
            await deleteDoc(doc(db, "voiceNotes", noteId));
            // Deletion is reflected automatically by onSnapshot
        } catch (error) {
            console.error("Error deleting voice note:", error);
            Alert.alert("Error", "Failed to delete the voice note/file.");
        }
    }
    
    // ----------------------------------------------------------------------
    // --- VOICE LOGIC (START/STOP/UPLOAD/PLAY) ---
    // ----------------------------------------------------------------------
    
    // ... (Your startRecording, stopRecording, uploadAudioAsync, playAudio functions are here)

    async function startRecording() {
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to start recording.');
            return;
        }
        
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we still need the microphone permission...');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);

        } catch (err) {
            console.error('failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        setIsRecording(false);

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);

        await uploadAudioAsync(uri);
    }

    async function uploadAudioAsync(uri) {
        const user = auth.currentUser;
        if (!uri || !user) return;

        setIsUploading(true);

        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const userId = user.uid;
            const fileName = `voice-notes/${userId}/${new Date().toISOString()}.m4a`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            // Save metadata to Firestore, including userId and the fileName for deletion
            await addDoc(collection(db, "voiceNotes"), {
                userId: userId,
                url: downloadURL,
                fileName: fileName, // <-- Storing fileName is crucial for storage deletion
                createdAt: serverTimestamp(),
            });

        } catch (error) {
            console.error("Error uploading audio: ", error);
            Alert.alert("Error", "There was an error uploading your note. Check console for details.");
        } finally {
            setIsUploading(false);
        }
    }

    async function playAudio(url) {
        if (currentSound) {
            await currentSound.unloadAsync();
            setCurrentSound(null);
            if (currentSound._uri === url) return;
        }

        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });

            const { sound } = await Audio.Sound.createAsync({ uri: url });
            setCurrentSound(sound);
            await sound.playAsync();

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    sound.unloadAsync();
                    setCurrentSound(null);
                }
            });

        } catch (error) {
            console.error("Error playing audio: ", error);
        }
    }

    // --- Render Functions for FlatLists (UPDATED) ---

    const renderVoiceNote = ({ item }) => (
        <View style={styles.voiceNoteContainer}>
            <Text style={styles.voiceNoteDate}>
                {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : 'Saving...'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button 
                    title={currentSound && currentSound._uri === item.url ? "Stop" : "Play"} 
                    onPress={() => playAudio(item.url)} 
                    color={currentSound && currentSound._uri === item.url ? '#5D9C4A' : '#43A047'} // Darker green for playing
                />
                <Button 
                    title="Delete" 
                    onPress={() => confirmAndDeleteVoiceNote(item.id, item.fileName)} 
                    color={colors.deleteButton} 
                />
            </View>
        </View>
    );
    
    const renderTextNote = ({ item }) => (
        <TextNoteCard
            title={item.title || "Untitled Note"}
            date={item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString('en-GB') : '...'}
            iconName="pin-outline"
            cardText={item.text || "No content."}
            onPress={() => navigation.navigate('CreateNote', { note: item })} 
            onDeletePress={() => confirmAndDeleteTextNote(item.id)} // Pass ID to deletion function
        />
    );


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* 1. TOP HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notes/Journal</Text>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('CreateNote')}
                    >
                        <Image
                            source={require('../assets/icons/cat-icon.png')}
                            style={styles.homeIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* 2. SCROLLABLE CONTENT (FlatList and Button areas) */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>

                    {/* --- Record Button Area --- */}
                    <View style={styles.recordButtonContainer}>
                        <Text style={styles.listTitle}>Voice Notes</Text>
                        <View style={{ marginTop: 10, width: '100%' }}>
                            {isUploading ? (
                                <ActivityIndicator size="large" color={'#43A047'} />
                            ) : (
                                <Button
                                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                                    onPress={isRecording ? stopRecording : startRecording}
                                    color={isRecording ? colors.deleteButton : '#43A047'} // Red / Green
                                />
                            )}
                        </View>
                    </View>

                    {/* --- Voice Notes List --- */}
                    <Text style={styles.listTitle}>Voice Notes</Text>
                    {isLoadingVoiceNotes ? (
                        <ActivityIndicator size="small" color={colors.headerText} />
                    ) : voiceNotes.length === 0 ? (
                        <Text style={styles.emptyText}>No voice notes recorded yet.</Text>
                    ) : (
                        <FlatList
                            data={voiceNotes}
                            renderItem={renderVoiceNote}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    )}
                    
                    {/* --- Text Notes List --- */}
                    <Text style={[styles.listTitle, { marginTop: 25 }]}>Text Notes</Text>
                    {isLoadingTextNotes ? (
                        <ActivityIndicator size="small" color={colors.headerText} />
                    ) : textNotes.length === 0 ? (
                        <Text style={styles.emptyText}>No text notes created yet.</Text>
                    ) : (
                        <FlatList
                            data={textNotes}
                            renderItem={renderTextNote}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    )}

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 30 : 10,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: colors.headerText,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.headerText,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 20,
    },
    recordButtonContainer: {
        backgroundColor: colors.card,
        borderRadius: 30,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // --- Voice Note List Styles ---
    voiceNoteContainer: {
        backgroundColor: colors.card,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    voiceNoteDate: {
        fontSize: 14,
        color: colors.headerText,
    },
    // --- Text Note Styles (updated) ---
    noteContainer: {
        marginBottom: 25,
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 5,
    },
    noteHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    noteHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noteTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.headerText,
    },
    noteDate: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.headerText,
        paddingBottom: 1,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 30,
        padding: 25,
        minHeight: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.cardTitle,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        color: colors.cardText,
        lineHeight: 24,
    },
    iconWrapper: {
        width: 60,
        height: 60,
        backgroundColor: colors.primary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    homeIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    deleteIconWrapper: {
        paddingHorizontal: 5,
    }
});