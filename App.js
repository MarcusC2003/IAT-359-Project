import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // https://reactnavigation.org/docs/bottom-tab-navigator/
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screen imports
import HomeScreen from "./src/screens/HomeScreen"; 
import TaskScreen from "./src/screens/TaskScreen";
import NotesScreen from "./src/screens/NotesScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
// import AuthScreen from "./src/screens/AuthScreen";
import NavBar from "./src/components/NavBar";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabLayout() {
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


// Page Management
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Login" component={AuthScreen} /> */}
        <Stack.Screen name="Main" component={TabLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
