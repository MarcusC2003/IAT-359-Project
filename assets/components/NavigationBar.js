import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function NavigationBar() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {/* Calendar */}
        <View style={styles.tab}>
          <Image
            source={require('../icons/calendar_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.label}>Calendar</Text>
        </View>

        {/* Tasks */}
        <View style={styles.tab}>
          <Image
            source={require('../icons/checklist_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.label}>Tasks</Text>
        </View>

        {/* Center Home bump */}
        <View style={styles.homeButton}>
          <View style={styles.homeRing}>
            <View style={styles.homeInner}>
              <Image
                source={require('../icons/cat_icon.png')}
                style={styles.homeIcon}
                resizeMode="contain"
              />
              <Text style={styles.homeLabel}>Home</Text>
            </View>
          </View>
        </View>

        {/* Weather */}
        <View style={styles.tab}>
          <Image
            source={require('../icons/weather_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.label}>Weather</Text>
        </View>

        {/* Notes */}
        <View style={styles.tab}>
          <Image
            source={require('../icons/cards_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.label}>Notes</Text>
        </View>
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 6,
  },

  // main bar background
  bar: {
    width: '92%',
    height: 84,
    backgroundColor: '#D68567',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // icons & labels
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#5B3C2E',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // center bump
  homeButton: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    width: 112,
    height: 112,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRing: {
    width: 112,
    height: 112,
    borderRadius: 9999,
    backgroundColor: '#B8745C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeInner: {
    width: 92,
    height: 92,
    borderRadius: 9999,
    backgroundColor: '#6B3B2F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  homeIcon: {
    width: 34,
    height: 34,
    tintColor: '#EFE7DA',
  },
  homeLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EFE7DA',
  },
});
