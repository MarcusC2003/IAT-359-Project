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

// 1.
// --- IMPORT CORRECTION ---
// You were importing the file as 'CreateNote' but using it as 'CreateNoteScreen'
// Make sure the file name is 'CreateNoteScreen.js'
//
import CreateNoteScreen from './src/screens/CreateNote'; 

//using stack Navigator 
const Stack = createNativeStackNavigator();

//The export default function App stuff
export default function App() {
  return (
    // navigationContainer
    <NavigationContainer>
      {/* define the screen that is clickable */}

      {/* The first screen listed is the default starting screen */}

      {/* 2.
        --- ORDER CORRECTION ---
        'Login' must be the first screen in the list.
        The app will now start on 'Login', and 'CreateNote' will have a screen to "go back" to.
      */}
      <Stack.Navigator>
        <Stack.Screen
          name="Login" // navigater name
          component={AuthScreen}
          options={{ headerShown: false }} // No header on the login screen
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // no default we got special custom
          options={{ headerShown: false }}
        />
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

        {/* This screen is now correctly placed. It's on the "map" but not the start. */}
        <Stack.Screen 
          name="CreateNote" 
          component={CreateNoteScreen}
          // This will add a header with a back arrow
          options={{ 
            title: 'Note', // Set the title of the header
            headerShown: true 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}