import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function NavBar({ page }) {
  const COLORS = {
    bg: "#EFE6DE",
    text: "#844634",
    topBar: "#E0916C",
    navBg: "#E0916C",
    muted: "#FFFFFFFF",
  };

  return (
    <View style={[styles(COLORS).navBar]}>
      {/* Calendar Page */}
      <TouchableOpacity style={styles(COLORS).navItem}>
        <Image
          source={require("../../assets/icons/calendar_icon.png")}
          style={styles(COLORS).navIcon}
        />
        <Text style={styles(COLORS).navText}>Calendar</Text>
      </TouchableOpacity>

      {/* Tasks Page */}
      <TouchableOpacity style={styles(COLORS).navItem}>
        <Image
          source={require("../../assets/icons/checklist_icon.png")}
          style={styles(COLORS).navIcon}
        />
        <Text style={styles(COLORS).navText}>Tasks</Text>
      </TouchableOpacity>

      {/* Home Page */}
      <View style={styles(COLORS).homeOuter}>
        <View style={styles(COLORS).homeRing}>
          <View style={styles(COLORS).homeInner}>
            <TouchableOpacity
              style={styles(COLORS).homeTap}
              activeOpacity={0.4}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles(COLORS).homeContent}>
                <Image
                  source={require("../../assets/icons/cat_icon.png")}
                  style={styles(COLORS).homeIcon}
                  resizeMode="contain"
                />
                <Text style={styles(COLORS).homeLabel}>Home</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Weather Page */}
      <TouchableOpacity style={styles(COLORS).navItem}>
        <Image
          source={require("../../assets/icons/weather_icon.png")}
          style={styles(COLORS).navIcon}
        />
        <Text style={styles(COLORS).navText}>Weather</Text>
      </TouchableOpacity>

      {/* Notes Page */}
      <TouchableOpacity style={styles(COLORS).navItem}>
        <Image
          source={require("../../assets/icons/cards_icon.png")}
          style={styles(COLORS).navIcon}
        />
        <Text style={styles(COLORS).navText}>Notes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (COLORS) =>
  StyleSheet.create({
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
      bottom:10,
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
