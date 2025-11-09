import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

// components
import NavigationBar from '../components/NavigationBar';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../../assets/components/Home_Page.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Top bar */}
      <View style={styles.header}>
        <View style={styles.spacer} /> 
        <TouchableOpacity style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icons/cat_icon.png')}
            style={styles.homeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Good morning, User :)</Text>

      {/* Bottom nav */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#E0916C',
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
  greeting: {
    marginTop: 50,
    fontSize: 20,
    color: '#5B3C2E',
    fontWeight: '500',
  },
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
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});
