import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { app } from '../utils/firebaseConfig';

const auth = getAuth(app);

const colors = {
    screenBackground: "#E9E3D5",
    card: "#fff",
    primary: "#E0916C",
    textPrimary: "#5B3C2E",
    textAccent: "#E8A93A",
    borderColor: "#d8d4ce",
    inputBackground: "#FAF8F6",
};

export default function CreateNoteScreen({ navigation, route }) {
    const [fontsLoaded] = useFonts({ Fredoka: require("../assets/fonts/Fredoka.ttf") });

    const noteToEdit = route.params?.note;
    const isEditing = !!noteToEdit;

    const [noteTitle, setNoteTitle] = useState(noteToEdit ? noteToEdit.title : '');
    const [noteText, setNoteText] = useState(noteToEdit ? noteToEdit.text : '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'Edit Note' : 'Create Note',
        });
    }, [navigation, isEditing]);

    const saveNote = async () => {
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
            Alert.alert('Authentication Required', 'Please log in to save or update notes.');
            return;
        }

        if (!noteTitle.trim() || !noteText.trim()) {
            Alert.alert('Error', 'Please fill out both title and text.');
            return;
        }

        Keyboard.dismiss();
        setIsSaving(true);

        try {
            if (isEditing) {
                const noteRef = doc(db, "notes", noteToEdit.id);
                await updateDoc(noteRef, {
                    title: noteTitle,
                    text: noteText,
                    updatedAt: serverTimestamp(),
                    userId: currentUserId,
                });

            } else {
                await addDoc(collection(db, "notes"), {
                    title: noteTitle,
                    text: noteText,
                    createdAt: serverTimestamp(),
                    userId: currentUserId,
                });
            }

            navigation.goBack();

        } catch (e) {
            console.error("Error saving document: ", e);
            Alert.alert('Error', 'Could not save note to database.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" style={styles.loading} />;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.screen}>
                <Text style={styles.pageTitle}>{isEditing ? 'Edit Your Note' : 'New Note Entry'}</Text>

                <View style={styles.card}>
                    <Text style={styles.date}>
                        {isEditing ? `Last saved: ${noteToEdit.date || '...'}` : 'Saving now...'}
                    </Text>
                    
                    <View style={styles.divider} />

                    <Text style={styles.label}>Note Title</Text>
                    <TextInput
                        style={styles.inputTitle}
                        placeholder="Project proposal..."
                        placeholderTextColor={colors.textPrimary + '80'}
                        value={noteTitle}
                        onChangeText={setNoteTitle}
                    />

                    <Text style={[styles.label, {marginTop: 15}]}>Note Content</Text>
                    <TextInput
                        style={styles.inputBody}
                        placeholder="Type your note here..."
                        placeholderTextColor={colors.textPrimary + '80'}
                        value={noteText}
                        onChangeText={setNoteText}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={saveNote}
                        disabled={isSaving}
                        activeOpacity={0.8}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.actionText}>{isEditing ? "Update Note" : "Save Note"}</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.screenBackground,
    },
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
        paddingTop: 8,
    },
    pageTitle: {
        fontFamily: "Fredoka",
        fontSize: 32,
        fontWeight: "900",
        color: colors.textPrimary,
        paddingHorizontal: 20,
        marginTop: 12,
    },
    card: {
        marginTop: 12,
        marginHorizontal: 16,
        backgroundColor: colors.card,
        borderRadius: 36,
        paddingVertical: 28,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        flex: 1,
    },
    date: {
        fontFamily: "Fredoka",
        textAlign: "center",
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: "700",
        opacity: 0.8,
    },
    divider: {
        height: 4,
        width: "86%",
        alignSelf: "center",
        backgroundColor: "#e6ddcf",
        borderRadius: 8,
        marginTop: 14,
        marginBottom: 20,
        opacity: 0.9,
    },
    label: {
        fontFamily: "Fredoka",
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: '900',
        marginBottom: 8,
        paddingLeft: 5,
    },
    inputTitle: {
        fontFamily: "Fredoka",
        backgroundColor: colors.inputBackground,
        borderRadius: 16,
        padding: 16,
        fontSize: 18,
        marginBottom: 10,
        borderColor: colors.borderColor,
        borderWidth: 1,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    inputBody: {
        fontFamily: "Fredoka",
        backgroundColor: colors.inputBackground,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        height: 300,
        textAlignVertical: 'top',
        marginBottom: 30,
        borderColor: colors.borderColor,
        borderWidth: 1,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    actionBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    actionText: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 18,
        fontFamily: "Fredoka",
    },
});