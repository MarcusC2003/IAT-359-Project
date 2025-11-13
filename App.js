import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_auth } from "./src/utils/firebaseConfig";

// Screens
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TaskScreen from "./src/screens/TaskScreen";
import NotesScreen from "./src/screens/NotesScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import CalendarScreen from "./src/screens/CalendarScreen";

// Custom tab bar
import NavBar from "./src/components/NavBar";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// main tabs whgen logged in
function ProtectedTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <NavBar page={state.routeNames[state.index]} navigation={navigation} />
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TaskScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Weather" component={WeatherScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
    </Tab.Navigator>
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

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Navigation Stack 
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={ProtectedTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ title: "Authentication" }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
