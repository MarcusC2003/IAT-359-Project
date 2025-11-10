import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity, // <-- Added
} from 'react-native';

// Removed MaterialCommunityIcons

// --- Color Palette (Merged from your guide) ---
const colors = {
  background: '#f7f1eb',
  headerText: '#5c3a2c',
  primary: '#E0916C', // From your guide's 'navBar'
  white: '#fff', // From your guide's 'navText'
  card: '#ffffff',
  cardTitle: 'rgba(60, 30, 20, 0.15)',
  cardText: 'rgba(60, 30, 20, 0.4)',
};

// --- Reusable Note Card Component ---
const NoteCard = ({ title, date, iconName, cardTitle, cardText }) => {
  // This component uses MaterialCommunityIcons, so we'll import it here
  // for local use just inside this component.
  const { MaterialCommunityIcons } = require('@expo/vector-icons');

  return (
    <View style={styles.noteContainer}>
      <View style={styles.noteHeader}>
        <View style={styles.noteHeaderLeft}>
          <Text style={styles.noteTitle}>{title}</Text>
          <Text style={styles.noteDate}>{date}</Text>
        </View>
        {/* This icon is for the pin/list, not the tab bar, so it's okay. */}
        <MaterialCommunityIcons name={iconName} size={24} color={colors.headerText} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{cardTitle}</Text>
        <Text style={styles.cardText}>{cardText}</Text>
      </View>
    </View>
  );
};

// --- Main NotesScreen Component ---
// UPDATED: Fixed function name and navigation prop
export default function NotesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1. TOP HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notes/Journal</Text>
          {/* UPDATED: Applied 'iconWrapper' style from your guide */}
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/icons/cat_icon.png')}
              // UPDATED: Applied 'homeIcon' style from your guide
              style={styles.homeIcon}
            />
          </View>
        </View>

        {/* 2. SCROLLABLE CONTENT (Unchanged) */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <NoteCard
            title="Project proposal"
            date="13/10"
            iconName="pin-outline"
            cardTitle="Project proposal"
            cardText="The adhd friendly app that has your calendar, to dos, weather, notes all in your custom room"
          />
          <NoteCard
            title="Birthday with bestie"
            date="12/10"
            iconName="format-list-bulleted"
            cardTitle="IT was so funn"
            cardText="We had such a wonderful time and it was so nice to be able to check up again..."
          />
          <NoteCard
            title="Birthday with bestie"
            date="12/10"
            iconName="pin-outline"
            cardTitle=""
            cardText=""
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- Stylesheet (Merged) ---
const styles = StyleSheet.create({
  // --- Page-specific styles ---
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
    color: colors.cardTitle,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: colors.cardText,
    lineHeight: 24,
  },

  // --- STYLES FROM YOUR MAIN STYLE GUIDE ---
  iconWrapper: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary, // '#E0916C'
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
    backgroundColor: colors.primary, // '#E0916C'
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
    color: colors.white, // '#fff'
    fontWeight: '500',
  },
});