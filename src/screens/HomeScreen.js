import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import NavBar from "../components/NavBar";

const COLORS = {
  bg: "#EFE6DE",
  text: "#844634",
  topBar: "#E0916C",
  navBg: "#E0916C",
  muted: "#FFFFFFFF",
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Fredoka: require("../assets/fonts/Fredoka.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/home_background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.topBar, { paddingTop: insets.top }]} />
        <Text style={styles.greeting}>Good morning, User</Text>
        <NavBar page="home" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  background: {
    flex: 1,
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    height: 60,
    backgroundColor: COLORS.topBar,
  },
  greeting: {
    fontFamily: "Fredoka",
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 65,
    marginBottom: "auto",
  },
});
