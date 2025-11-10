import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function NavBar({ page, navigation }) {
  return (
    <View style={[styles.navBar]}>
      {/* Tasks Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Calendar")}>
        <Image source={require("../assets/icons/calendar_icon.png")} style={styles.navIcon} />
        <Text style={styles.navText}>Calendar</Text>
      </TouchableOpacity>

      {/* Tasks Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Tasks")}>
        <Image source={require("../assets/icons/checklist_icon.png")} style={styles.navIcon} />
        <Text style={styles.navText}>Tasks</Text>
      </TouchableOpacity>

      {/* Home Button */}
      <View style={styles.homeOuter}>
        <View style={styles.homeRing}>
          <View style={styles.homeInner}>
            <TouchableOpacity
              style={styles.homeTap}
              activeOpacity={0.4}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => navigation.navigate("Home")}
            >
              <View style={styles.homeContent}>
                <Image source={require("../assets/icons/cat_icon.png")} style={styles.homeIcon} resizeMode="contain" />
                <Text style={styles.homeLabel}>Home</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Weather Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Weather")}>
        <Image source={require("../assets/icons/weather_icon.png")} style={styles.navIcon} />
        <Text style={styles.navText}>Weather</Text>
      </TouchableOpacity>

      {/* Notes Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Notes")}>
        <Image source={require("../assets/icons/cards_icon.png")} style={styles.navIcon} />
        <Text style={styles.navText}>Notes</Text>
      </TouchableOpacity>
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
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontFamily: "Fredoka",
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.muted,
  },
  homeOuter: {
    alignItems: "center",
    justifyContent: "center",
    bottom: 10,
  },
  homeRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.navBg,
    alignItems: "center",
    justifyContent: "center",
  },
  homeInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
  homeContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  homeIcon: {
    width: 36,
    height: 36,
    tintColor: COLORS.muted,
    marginBottom: 2,
  },
  homeLabel: {
    fontFamily: "Fredoka",
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 2,
  },
});
