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
    Alert,
} from 'react-native';
import { useFonts } from "expo-font";
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
    deleteDoc,
    doc,
    addDoc, 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../utils/firebaseConfig'; 

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const colors = {
    background: '#f7f1eb',
    primary: '#E0916C', 
    textPrimary: '#5c3a2c',
    textSecondary: '#8a8a8a',
    white: '#fff', 
    checkboxBorder: '#e09a80',
    checkboxText: '#5c3a2c',
    completedText: 'rgba(92, 58, 44, 0.4)',
    deleteIcon: '#d16160ff',
    card: '#fff',
};

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


export default function NotesScreen({ navigation }) {
    const [fontsLoaded] = useFonts({ Fredoka: require("../assets/fonts/Fredoka.ttf") });
    const currentUserId = auth.currentUser?.uid;

    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [voiceNotes, setVoiceNotes] = useState([]);
    const [isLoadingVoiceNotes, setIsLoadingVoiceNotes] = useState(true);
    const [currentSound, setCurrentSound] = useState(null);

    const [textNotes, setTextNotes] = useState([]);
    const [isLoadingTextNotes, setIsLoadingTextNotes] = useState(true);

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
        } catch (error) {
            console.error("Error deleting text note:", error);
            Alert.alert("Error", "Failed to delete the text note.");
        }
    }

    async function deleteVoiceNote(noteId, fileName) {
        try {
            const storageRef = ref(storage, fileName);
            await deleteObject(storageRef);

            await deleteDoc(doc(db, "voiceNotes", noteId));
        } catch (error) {
            console.error("Error deleting voice note:", error);
            Alert.alert("Error", "Failed to delete the voice note/file.");
        }
    }
    
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

            await addDoc(collection(db, "voiceNotes"), {
                userId: userId,
                url: downloadURL,
                fileName: fileName,
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

    const renderVoiceNote = ({ item }) => (
        <View style={styles.voiceNoteContainer}>
            <Text style={styles.voiceNoteDate}>
                {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString() : 'Saving...'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button 
                    title={currentSound && currentSound._uri === item.url ? "Stop" : "Play"} 
                    onPress={() => playAudio(item.url)} 
                    color={currentSound && currentSound._uri === item.url ? colors.textSecondary : colors.primary} 
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
            onDeletePress={() => confirmAndDeleteTextNote(item.id)}
        />
    );

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" style={styles.loading} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notes & Voice Memos</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>

                    <View style={styles.recordButtonContainer}>
                        <Text style={styles.listTitle}>Voice Memos</Text>
                        <View style={{ marginTop: 10, width: '100%' }}>
                            {isUploading ? (
                                <ActivityIndicator size="large" color={colors.primary} />
                            ) : (
                                <Button
                                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                                    onPress={isRecording ? stopRecording : startRecording}
                                    color={isRecording ? colors.deleteButton : colors.primary} 
                                />
                            )}
                        </View>
                    </View>

                    <Text style={[styles.listTitle, { marginTop: 25 }]}>Voice Memos</Text>
                    {isLoadingVoiceNotes ? (
                        <ActivityIndicator size="small" color={colors.headerText} />
                    ) : voiceNotes.length === 0 ? (
                        <Text style={styles.emptyText}>No voice memos recorded yet.</Text>
                    ) : (
                        <FlatList
                            data={voiceNotes}
                            renderItem={renderVoiceNote}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            style={{marginBottom: 25}}
                        />
                    )}
                    
                    <Text style={styles.listTitle}>Text Notes</Text>
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

                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => navigation.navigate('CreateNote')}
                    >
                        <Text style={styles.fabIcon}>+</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
     flexGrow: 1, 
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
        fontFamily: "Fredoka",
        fontSize: 32,
        fontWeight: '900',
        color: colors.headerText,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 150,
    },
    listTitle: {
        fontFamily: "Fredoka",
        fontSize: 22,
        fontWeight: '700',
        color: colors.headerText,
        marginBottom: 10,
    },
    emptyText: {
        fontFamily: "Fredoka",
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
        color: colors.textPrimary,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        color: colors.textSecondary,
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
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 80,
        backgroundColor: colors.primary,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#3a1f08ff',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    fabIcon: {
        fontSize: 30,
        color: 'white',
        lineHeight: 30,
    },
});