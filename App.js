import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_auth } from "./src/utils/firebaseConfig";
import * as Haptics from 'expo-haptics';

import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TaskScreen from "./src/screens/TaskScreen";
import NotesScreen from "./src/screens/NotesScreen";
import CreateNoteScreen from "./src/screens/CreateNote";
import WeatherScreen from "./src/screens/WeatherScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import CreateTaskScreen from "./src/screens/CreateTaskScreen";

import NavBar from "./src/components/NavBar";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const SubStack = createNativeStackNavigator();

function NotesStack() {
  return (
    <SubStack.Navigator screenOptions={{ headerShown: false }}>
      <SubStack.Screen name="NotesList" component={NotesScreen} />
    </SubStack.Navigator>
  );
}

function TasksStack() {
  return (
    <SubStack.Navigator screenOptions={{ headerShown: false }}>
      <SubStack.Screen name="TasksList" component={TaskScreen} />
    </SubStack.Navigator>
  );
}

function ProtectedTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <NavBar page={state.routeNames[state.index]} navigation={navigation} />
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TasksStack} />
      <Tab.Screen name="Notes" component={NotesStack} />
      <Tab.Screen name="Weather" component={WeatherScreen} />
      <Tab.Screen name="Calendar" component={CalendarStack} />
    </Tab.Navigator>
  );
}
function NotesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notes" component={NotesScreen} />
      <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
    </Stack.Navigator>
  );
}
function CalendarStack() {
  return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="CalendarPage"
          component={CalendarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateTask"
          component={CreateTaskScreen}
          options={{ headerShown: false }}
        />

    </Stack.Navigator>
  );
}



export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebase_auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, [initializing]);

  useEffect(() => {
    if (!initializing && user) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [initializing, user]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <RootStack.Screen name="Main" component={ProtectedTabs} />

            <RootStack.Screen 
                name="EditTask" 
                component={EditTaskScreen} 
                options={{ presentation: 'modal' }} 
            />
            <RootStack.Screen 
                name="CreateNote" 
                component={CreateNoteScreen} 
                options={{ presentation: 'modal' }} 
            />
          </>
        ) : (
          <RootStack.Screen 
            name="Auth" 
            component={AuthScreen} 
            options={{ title: "Authentication" }} 
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}