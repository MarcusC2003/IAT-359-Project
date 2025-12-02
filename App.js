import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_auth } from "./src/utils/firebaseConfig";
import * as Haptics from "expo-haptics";

import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TaskScreen from "./src/screens/TaskScreen";
import NotesScreen from "./src/screens/NotesScreen";
import CreateNoteScreen from "./src/screens/CreateNote";
import WeatherScreen from "./src/screens/WeatherScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import CreateTaskScreen from "./src/screens/CreateTaskScreen";
import EditTaskScreen from "./src/screens/EditTaskScreen";

import NavBar from "./src/components/NavBar";

// --- Navigators ---
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// separate stacks for each section that needs its own stack
const NotesStackNav = createNativeStackNavigator();
const TasksStackNav = createNativeStackNavigator();
const CalendarStackNav = createNativeStackNavigator();

// --- Stacks per tab ---

function NotesStack() {
  return (
    <NotesStackNav.Navigator screenOptions={{ headerShown: false }}>
      <NotesStackNav.Screen name="NotesList" component={NotesScreen} />
      <NotesStackNav.Screen name="CreateNote" component={CreateNoteScreen} />
    </NotesStackNav.Navigator>
  );
}

function TasksStack() {
  return (
    <TasksStackNav.Navigator screenOptions={{ headerShown: false }}>
      <TasksStackNav.Screen name="TasksList" component={TaskScreen} />
      <TasksStackNav.Screen name="EditTask" component={EditTaskScreen} />
    </TasksStackNav.Navigator>
  );
}

function CalendarStack() {
  return (
    <CalendarStackNav.Navigator screenOptions={{ headerShown: false }}>
      <CalendarStackNav.Screen
        name="CalendarPage"
        component={CalendarScreen}
      />
      <CalendarStackNav.Screen
        name="CreateTask"
        component={CreateTaskScreen}
      />
    </CalendarStackNav.Navigator>
  );
}

// --- Tabs for logged-in users ---

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

// --- Root app ---

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
          <RootStack.Screen name="Main" component={ProtectedTabs} />
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
