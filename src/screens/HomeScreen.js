import React from "react";
import {View,Text,Image,ImageBackground,StyleSheet,TouchableOpacity} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/components/Home_Page.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.topBar, { paddingTop: insets.top }]} />

        <Text style={styles.greeting}>Good morning, User</Text>

        <View
          style={[
            styles.navBar,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
          ]}
        >
          <TouchableOpacity style={styles.navItem}>
            <Image source={require("../../assets/icons/calendar_icon.png")} style={styles.navIcon} />
            <Text style={styles.navText}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Image source={require("../../assets/icons/checklist_icon.png")} style={styles.navIcon} />
            <Text style={styles.navText}>Tasks</Text>
          </TouchableOpacity>

          {/* HOME: only the inner cat fades, rings stay opaque */}
        <View style={styles.homeOuter}>
          <View style={styles.homeRing}>
            <View style={styles.homeInner}>
              <TouchableOpacity
                style={styles.homeTap}
                activeOpacity={0.4}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={styles.homeContent}>
                  <Image
                    source={require("../../assets/icons/cat_icon.png")}
                    style={styles.homeIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.homeLabel}>Home</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>


          <TouchableOpacity style={styles.navItem}>
            <Image source={require("../../assets/icons/weather_icon.png")} style={styles.navIcon} />
            <Text style={styles.navText}>Weather</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Image source={require("../../assets/icons/cards_icon.png")} style={styles.navIcon} />
            <Text style={styles.navText}>Notes</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const COLORS = {
  bg: "#EFE6DE",
  text: "#844634",
  topBar: "#E0916C",
  navBg: "#E0916C",
  muted: "#FFFFFFFF",
};

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
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 65,
    marginBottom: "auto",
  },
  navBar: {
    width: "100%",
    height: 100,
    backgroundColor: COLORS.navBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  homeOuter: {
    alignItems: "center",
    justifyContent: "center",
    top:8,
    gap: 4,
  },
  homeRing: {
    width: 112,
    height: 112,
    borderRadius: "100%",
    backgroundColor: COLORS.navBg,
    alignItems: "center",
    justifyContent: "center",
  },
  homeInner: {
    width: 90,
    height: 90,
    borderRadius: "100%",
    backgroundColor: COLORS.text,
    alignItems: "center",
    justifyContent: "center",

  },
  homeTap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIcon: {
    width: 36,
    height: 36,
  },
  homeLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.muted,
    marginTop: 4,
  },
  homeContent: {
  alignItems: "center",
  justifyContent: "center",
},
  
});