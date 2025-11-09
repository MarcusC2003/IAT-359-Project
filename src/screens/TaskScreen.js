import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';

// --- Color Palette (Updated to match your guide's colors) ---
const colors = {
  background: '#f7f1eb',
  primary: '#E0916C', // From your guide's 'iconWrapper' and 'navBar'
  textPrimary: '#5c3a2c',
  textSecondary: '#8a8a8a',
  white: '#fff', // From your guide's 'navText'
  checkboxBorder: '#e09a80',
  checkboxText: '#5c3a2c',
};

// --- Reusable Task Item Component (Unchanged) ---
const TaskItem = ({ text }) => {
  return (
    <View style={styles.taskItem}>
      <Image
        source={require('../../assets/icons/circle_icon_notes.png')}
        style={styles.checkbox}
      />
      <Text style={styles.taskText}>{text}</Text>
    </View>
  );
};

// --- Main TaskScreen Component ---
// UPDATED: Added { navigation } prop
export default function TaskScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* UPDATED: Using style 'iconWrapper' from your guide */}
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icons/cat_icon.png')}
            // UPDATED: Using style 'homeIcon' from your guide
            style={styles.homeIcon}
          />
        </View>

        {/* Header Section (Unchanged) */}
        <View style={styles.mainHeader}>
          <Text style={styles.appTitle}>Palananner</Text>
          <Text style={styles.appDescription}>
            The adhd friendly app that has your calendar, to dos, weather, notes
            all in your custom room
          </Text>
        </View>

        {/* Scrollable Task Content (Unchanged) */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ... (All your TaskItem components remain here) ... */}
           {/* Actions for today! */}
           <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actions for today!</Text>
            <Image
              source={require('../../assets/icons/flag_icon.png')}
              style={styles.flagIcon}
            />
          </View>
          <TaskItem text="Complete color scheme" />

          {/* For this week: */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For this week:</Text>
          </View>
          <TaskItem text="Complete mock-up key frames" />
          <TaskItem text="Draft visual guideline" />
          <TaskItem text="Plan next steps" />

          {/* Just reminder: */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Just reminder:</Text>
          </View>
          <TaskItem text="Journal and try the best you can" />
        </ScrollView>

        {/* UPDATED: Bottom Tab Bar to match your 'navBar' style guide */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Calendar')} // <-- Added navigation
          >
            <Image
              source={require('../../assets/icons/calendar_icon.png')}
              style={styles.navIcon} // <-- Updated style name
            />
            <Text style={styles.navText}>Calender</Text> {/* <-- Updated style name */}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Tasks')} // <-- Added navigation
          >
            <Image
              source={require('../../assets/icons/checklist_icon.png')}
              style={styles.navIcon} // <-- Updated style name
            />
            <Text style={styles.navText}>To-dos</Text> {/* <-- Updated style name */}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Photos')} // <-- Added navigation (Assuming 'Photos' is the name in App.js)
          >
            <Image
              source={require('../../assets/icons/photo_icon.png')}
              style={styles.navIcon} // <-- Updated style name
            />
            <Text style={styles.navText}>Photos</Text> {/* <-- Updated style name */}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Notes')} // <-- Added navigation
          >
            <Image
              source={require('../../assets/icons/cards_icon.png')}
              style={styles.navIcon} // <-- Updated style name
            />
            <Text style={styles.navText}>Notes</Text> {/* <-- Updated style name */}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Stylesheet (Merged) ---
const styles = StyleSheet.create({
  // --- Styles from your TaskScreen ---
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainHeader: {
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 60 : 20,
    paddingBottom: 20,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  appDescription: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    maxWidth: '90%',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 100, // Space for the navBar
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  flagIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginRight: 15,
  },
  taskText: {
    fontSize: 18,
    color: colors.checkboxText,
    fontWeight: '500',
  },

  // --- STYLES UPDATED TO MATCH YOUR GUIDE ---
  iconWrapper: {
    // These styles are from your guide
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
    // These styles are kept from TaskScreen for positioning
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
    zIndex: 10,
  },
  homeIcon: {
    // From your guide
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  navBar: {
    // From your guide
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
    // From your guide
    alignItems: 'center',
  },
  navIcon: {
    // From your guide
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain', // Added this for good measure
  },
  navText: {
    // From your guide
    fontSize: 12,
    color: colors.white, // '#fff'
    fontWeight: '500',
  },
});