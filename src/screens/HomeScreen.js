import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import NavBar from "../components/NavBar";

// NEW: import popup + assets
import CustomizeRoomPortal, { popUp, PETS } from "../components/customizeRoom";

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

  // NEW: which pet is selected
  const [pet, setPet] = React.useState("dog1");

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/home-background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.topBar, { paddingTop: insets.top }]} />

        {/* --- Updated Pet Button: now opens popup --- */}
        <TouchableOpacity
          style={[styles.petButton, { top: insets.top + 12 }]}
          activeOpacity={0.8}
          onPress={() => popUp({ onSelect: setPet })}
        >
          <View style={styles.petButtonCircle}>
            <Image
              source={require("../assets/icons/pet-icon.png")}
              style={styles.petIcon}
            />
          </View>
        </TouchableOpacity>
        {/* --------------------------- */}

        <Text style={styles.greeting}>Good morning, User</Text>

        {/* NEW: show selected pet on the room */}
        <Image source={PETS[pet]} style={styles.petSprite} />

        <NavBar page="home" />
      </ImageBackground>

      {/* NEW: mount the popup portal once */}
      <CustomizeRoomPortal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  background: { flex: 1, alignItems: "center" },
  topBar: { width: "100%", height: 60, backgroundColor: COLORS.topBar },

  petButton: { position: "absolute", right: 20, zIndex: 10, marginTop: 20 },
  petButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  petIcon: { width: 22, height: 22, resizeMode: "contain", tintColor: COLORS.topBar },

  greeting: {
    fontFamily: "Fredoka",
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 100,
    marginBottom: "auto",
  },

  
  petSprite: {
    position: "absolute",
    bottom: 160,       
    alignSelf: "center",
    width: 100,
    height: 100,
    resizeMode: "contain",
    zIndex: 5,
  },
});
