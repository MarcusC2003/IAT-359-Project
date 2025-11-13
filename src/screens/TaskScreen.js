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

// --- Color Palette---
const colors = {
  background: '#f7f1eb',
  primary: '#E0916C', 
  textPrimary: '#5c3a2c',
  textSecondary: '#8a8a8a',
  white: '#fff', 
  checkboxBorder: '#e09a80',
  checkboxText: '#5c3a2c',
};

// --- Task Item Component---
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
// Added { navigation } prop
export default function TaskScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icons/cat_icon.png')}
            style={styles.homeIcon}
          />
        </View>

        <View style={styles.mainHeader}>
          <Text style={styles.appTitle}>Palananner</Text>
          <Text style={styles.appDescription}>
            The adhd friendly app that has your calendar, to dos, weather, notes
            all in your custom room
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>


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

        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Calendar')} 
          >
            <Image
              source={require('../../assets/icons/calendar_icon.png')}
              style={styles.navIcon} 
            />
            <Text style={styles.navText}>Calender</Text> 
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
            onPress={() => navigation.navigate('Photos')} 
          >
            <Image
              source={require('../../assets/icons/photo_icon.png')}
              style={styles.navIcon} 
            />
            <Text style={styles.navText}>Photos</Text> 
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('Notes')} 
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
    paddingBottom: 100, 
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
 
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
    zIndex: 10,
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
});