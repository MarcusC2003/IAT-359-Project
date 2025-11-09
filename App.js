  import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Imported Screens
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import TaskScreen from './src/screens/TaskScreen';
import NotesScreen from './src/screens/NotesScreen';
import WeatherScreen from './src/screens/WeatherScreen';

// initialize stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // navigationContainer
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tasks" 
          component={TaskScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Notes"
          component={NotesScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Weather"
          component={WeatherScreen}
          options={{ headerShown: false }} 
        />

        <Stack.Screen
          name="Login" 
          component={AuthScreen}
          options={{ headerShown: false }}
        />

        {/* We might add more lmao */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}