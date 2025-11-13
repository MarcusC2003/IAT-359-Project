import React from "react";
import {View,Text,ImageBackground,StyleSheet,TouchableOpacity,Image} from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFonts } from "expo-font";

// Components
import NavBar from "../components/NavBar";
import CustomizeRoomPopUp, {popUp,PET_LIST,loadSavedPet} from "../components/customizeRoom";

const COLORS = {
  bg: "#EFE6DE",
  text: "#844634",
  topBar: "#E0916C",
  navBg: "#E0916C",
  muted: "#FFFFFFFF",
};
// Set Default pet to Tubby
const DEFAULT_PET = "Tubby";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Fredoka: require("../assets/fonts/Fredoka.ttf"),
  });

  /* Load saved pet 
    if no pet is saved, default to DEFAULT_PET
  */
  const [pet, setPet] = useState(DEFAULT_PET);
  useEffect(() => {
    (async () => {
      const saved = await loadSavedPet(); 
      if (saved) {
        setPet(saved);
      } else {
        setPet(DEFAULT_PET);
      }
    })();
  }, []);

  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/home-background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.topBar, { paddingTop: insets.top }]} />

        {/* Pet button opens popup
        - Note: button is temporarily inside the topBar visually but will not be in the final design
        */}
        <TouchableOpacity
          style={[styles.petButton]}
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

        {/* "Phrase is temporary" */}
        <Text style={styles.greeting}>Good morning, User</Text>

        {/* Show selected pet in the room */}
        {pet && PET_LIST[pet] && (
          <Image source={PET_LIST[pet]} style={styles.petSprite} />
        )}

        <NavBar page="home" />
      </ImageBackground>

      {/* PopUp*/}
      <CustomizeRoomPopUp />
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
    height: 100,
    backgroundColor: COLORS.topBar,

  },

  petButton: {
    position: "absolute",
    right: 15,
    zIndex: 10,
    marginTop: 45,
  },

  petButtonCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.text,
    alignItems: "center",
    justifyContent: "center",
  },

  petIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    tintColor: "white",
  },

  greeting: {
    fontFamily: "Fredoka",
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 30,
    marginBottom: "auto",
  },

  petSprite: {
    position: "absolute",
    bottom: 200,
    alignSelf: "center",
    width: 70,
    height: 70,
    resizeMode: "contain",
    zIndex: 5,
  },
});
