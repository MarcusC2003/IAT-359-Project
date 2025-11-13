import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Keyboard, // For closing keyboard (Otherwise it stays up)
  TouchableWithoutFeedback, // For tapping background to close the keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../FirebaseConfig'; 
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

// --- Color Palette ---
const colors = {
  background: '#f7f1eb',
  headerText: '#5c3a2c',
  primary: '#E0916C',
  card: '#ffffff',
  cardText: 'rgba(60, 30, 20, 0.4)',
};

// --- Main Component ---
export default function CreateNoteScreen({ navigation, route }) {
  
  // 1. Check if we are editing
  // 'route.params' contains the 'note' object we passed from the list screen
  const noteToEdit = route.params?.note;
  const isEditing = !!noteToEdit; // true if we are editing, false if creating

  // 2. Set initial state
  // If editing, pre-fill state with the note's data. Otherwise, start empty.
  const [noteTitle, setNoteTitle] = useState(noteToEdit ? noteToEdit.title : '');
  const [noteText, setNoteText] = useState(noteToEdit ? noteToEdit.text : '');

  //3. Set the header title based on mode
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Note' : 'Create Note',
    });
  }, [navigation, isEditing]);


  // 4. Save/Update Function
  const saveNote = async () => {
    // Check for empty fields first
    if (noteTitle.trim().length === 0 || noteText.trim().length === 0) {
      Alert.alert('Error', 'Please fill out both title and text~');
      return; // Stop the function
    }

    // Dismiss keyboard *before* saving
    Keyboard.dismiss(); 

    // Try to save to Firebase
    try {
      if (isEditing) {
        // --- EDIT LOGIC (Firebase) ---
        const noteRef = doc(db, "notes", noteToEdit.id); 
        await updateDoc(noteRef, {
          title: noteTitle,
          text: noteText,
        });

      } else {
        // --- CREATE LOGIC (Firebase) ---
        await addDoc(collection(db, "notes"), {
          title: noteTitle,
          text: noteText,
          date: new Date().toLocaleDateString('en-GB').substring(0, 5),
          // TODO: Add a userId here once you have authentication
          // userId: auth.currentUser.uid 
        });
      }

      // If save is successful, go back
      navigation.goBack();

    } catch (e) {
      // If save fails, show an error
      console.error("Error saving document's': ", e);
      Alert.alert('Error', 'Could not save note to database...');
    }
  }; // --- End of saveNote function ---

  
  // 5. Render the screen
  return (
    // This wrapper dismisses the keyboard when you tap outside the text boxes
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.label}>Note Title</Text>
          <TextInput
            style={styles.inputTitle}
            placeholder="Project proposal..."
            value={noteTitle}
            onChangeText={setNoteTitle} // This allows you to type
          />
          <Text style={styles.label}>Note Content</Text>
          <TextInput
            style={styles.inputBody}
            placeholder="Type your note here..."
            value={noteText}
            onChangeText={setNoteText} // This allows you to type
            multiline
          />
          <Button 
            title={isEditing ? "Update Note" : "Save Note"} 
            onPress={saveNote} 
            color={colors.primary} 
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: colors.headerText,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputTitle: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  inputBody: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    height: 300,
    textAlignVertical: 'top', // we could take it out 
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});