import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- Correct import
import { useIsFocused } from '@react-navigation/native';

// --- Import Firebase ---
import { db } from '../FirebaseConfig'; // <-- Make sure path is correct
import { collection, getDocs } from 'firebase/firestore';

// --- Color Palette ---
const colors = {
  background: '#f7f1eb',
  primary: '#e09a80',
  headerText: '#5c3a2c', // Added this from your styles
  textPrimary: '#5c3a2c',
  textSecondary: '#8a8a8a',
  card: '#ffffff',
  inputBackground: '#f6f6f6',
  white: '#ffffff',
  black: '#333333',
  borderColor: '#e0e0e0',
};

// --- Reusable Note Card Component ---
const NoteCard = ({ title, date, iconName, cardTitle, cardText }) => {
  const { MaterialCommunityIcons } = require('@expo/vector-icons');

  return (
    <View style={styles.noteContainer}>
      <View style={styles.noteHeader}>
        <View style={styles.noteHeaderLeft}>
          <Text style={styles.noteTitle}>{title}</Text>
          <Text style={styles.noteDate}>{date}</Text>
        </View>
        <MaterialCommunityIcons name={iconName || "format-list-bulleted"} size={24} color={colors.headerText} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cardTitle}</Text>
        <Text style={styles.cardText}>{cardText}</Text>
      </View>
    </View>
  );
};


// --- Main NotesScreen Component ---
export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused(); // Hook to check if screen is active

  // --- 1. Load notes from FIREBASE ---
  const loadNotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "notes"));
      const loadedNotes = [];
      querySnapshot.forEach((doc) => {
        // 'doc.id' is the unique ID. 'doc.data()' is the object
        loadedNotes.push({ id: doc.id, ...doc.data() });
      });
      // Sort notes to show newest first
      setNotes(loadedNotes.sort((a, b) => (b.date > a.date ? 1 : -1)));
    } catch (e) {
      console.error('Failed to load notes from Firestore.', e);
    }
  };

  // --- 2. Reload notes when screen is focused ---
  useEffect(() => {
    if (isFocused) {
      loadNotes();
    }
  }, [isFocused]);

  // --- 3. Render function for each note ---
  const renderNote = ({ item }) => (
    // This makes each note clickable
    <TouchableOpacity
      onPress={() => {
        // Navigate to CreateNote, passing the 'item' object as a parameter
        navigation.navigate('CreateNote', { note: item });
      }}
    >
      <NoteCard
        title={item.title}
        date={item.date}
        iconName={item.iconName}
        cardTitle={item.title}
        cardText={item.text}
      />
    </TouchableOpacity>
  );


  // --- 4. Render the screen ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- TOP HEADER (Fixed) --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notes/Journal</Text>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../../assets/icons/cat_icon.png')} // Or your correct icon
              style={styles.homeIcon}
            />
          </View>
        </View>

        {/* --- NOTES LIST --- */}
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notes yet. Add one!</Text>
          }
        />

        {/* --- "CREATE NOTE" BUTTON (FAB) --- */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateNote')} // Navigates with no 'note' object
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

        {/* --- BOTTOM TAB BAR (Fixed) --- */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Calendar')} // Make sure 'Calendar' screen exists
          >
            <Image
              source={require('../../assets/icons/calendar_icon.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Tasks')}
          >
            <Image
              source={require('../../assets/icons/checklist_icon.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>To-dos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Photos')} // Make sure 'Photos' screen exists
          >
            <Image
              source={require('../../assets/icons/photo_icon.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Notes')} // Stays on this screen
          >
            <Image
              source={require('../../assets/icons/cards_icon.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>Notes</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// --- COMPLETE STYLESHEET ---
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
    paddingBottom: 100, // Make room for navBar
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
    fontSize: 40,
    fontWeight: 'bold',
    color: 'rgba(60, 30, 20, 0.15)',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: 'rgba(60, 30, 20, 0.4)',
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 14,
    position: 'absolute',
    bottom: 0,
    height: 90,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  navText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 110, // Positioned above the 90px navBar
    backgroundColor: colors.primary,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    lineHeight: 30,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'rgba(60, 30, 20, 0.4)',
  },
});