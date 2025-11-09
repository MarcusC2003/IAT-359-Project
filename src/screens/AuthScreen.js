import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image, // <-- Make sure Image is imported
} from 'react-native';

// We'll keep FontAwesome for the Google icon: https://fontawesome.com/icons
// but we've removed MaterialCommunityIcons
import { FontAwesome } from '@expo/vector-icons';

// --- Color Palette ---
const colors = {
  background: '#f7f1eb',
  primary: '#e09a80',
  textPrimary: '#5c3a2c',
  textSecondary: '#8a8a8a',
  card: '#ffffff',
  inputBackground: '#f6f6f6',
  white: '#ffffff',
  black: '#333333',
  borderColor: '#e0e0e0',
};

// --- Main AuthScreen Component ---
export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top right icon - UPDATED */}
          {/* <View style={styles.headerIconContainer}>
            <Image
              // The path is ../../ because you go up from 'screens', up from 'src'
              source={require('../../assets/icons/cat_icon.png')}
              style={styles.headerIcon}
            />
          </View> */}

          {/* Main Login Card */}
          <View style={styles.card}>
            {/* Logo*/}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/icons/cat_icon.png')}
                style={styles.logoIcon}
              />
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your cozy productivity space
            </Text>

            {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="•••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry // Hides password
            />

            {/* Sign In Button */}
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => navigation.navigate('Home')} // <-- This is INSIDE the tag
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign in with Google Button */}
            <TouchableOpacity style={styles.googleButton}>
              <FontAwesome name="google" size={20} color={colors.black} />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerIconContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Style for the header icon
  headerIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    marginTop: 80, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  // Style for the main logo icon
  logoIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  signInButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderColor,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  googleButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  signUpButton: {
    // This is a TouchableOpacity, so it's a button
  },
  signUpButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});