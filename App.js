// App.js imports 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//importing pages 
import AuthScreen from './src/screens/AuthScreen';
//import CalendarScreen from './src/screens/CalendarScreen';
import HomeScreen from './src/screens/HomeScreen';
import TaskScreen from './src/screens/TaskScreen';
//import WeatherScreen from './src/screens/WeatherScreen';
import NotesScreen from './src/screens/NotesScreen';

//using stack Navigator 
const Stack = createNativeStackNavigator();

//The export default function App stuff
export default function App() {
  return (
    // navigationContainer
    <NavigationContainer>
      {/* define the screen that is clickable */}

      {/* The first screen listed is the default starting screen */}
      <Stack.Navigator>
          <Stack.Screen
          name="Notes" // navigater name
          component={NotesScreen}
          // testing
          options={{ headerShown: false }} 
        />
          <Stack.Screen
          name="Tasks" // navigater name
          component={TaskScreen}
          // testing
          options={{ headerShown: false }} 
        />

        {/* --- 1. THIS IS NOW THE FIRST SCREEN --- */}
        <Stack.Screen
          name="Login" // navigater name
          component={AuthScreen}
          options={{ headerShown: false }} // No header on the login screen
        />

        {/* --- 2. HOME IS NOW THE SECOND SCREEN --- */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // no default we got special custom
          options={{ headerShown: false }}
        />


        {/* We might add more lmao */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}