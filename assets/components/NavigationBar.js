import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TABS = [
  { key: 'Calendar',  label: 'Calendar', icon: require('../assets/icons/calendar_icon.png') },
  { key: 'ToDos',     label: 'To-dos',   icon: require('../assets/icons/checklist_icon.png') },
  { key: 'Memories',  label: 'Memories', icon: require('../assets/icons/photo_icon.png') },
  { key: 'Notes',     label: 'Notes',    icon: require('../assets/icons/cards_icon.png') },
];

function BottomNav({ pageTitle }) {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      {TABS.map(tab => {
        const selected = tab.key === pageTitle;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, selected ? styles.navItemSelected : styles.navItemUnselected]}
            onPress={() => navigation.navigate(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Image
              source={tab.icon}
              style={[styles.navIcon, selected ? styles.iconSelected : styles.iconUnselected]}
            />
            <Text style={[styles.navText, selected ? styles.textSelected : styles.textUnselected]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default memo(BottomNav);

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E0916C',
    width: '100%',
    paddingVertical: 14,
    position: 'absolute',
    bottom: 0,
    height: 90,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  // exactly two visual states
  navItemSelected: { opacity: 1 },
  navItemUnselected: { opacity: 0.7 },

  navIcon: { width: 24, height: 24, marginBottom: 4 },
  iconSelected:   { transform: [{ scale: 1.1 }] },
  iconUnselected: { transform: [{ scale: 1 }] },

  navText: { fontSize: 12, fontWeight: '500' },
  textSelected:   { color: '#fff', fontWeight: '700' },
  textUnselected: { color: '#fff' },
});
