import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { fetchWeatherData } from "../api/weatherAPI";

export default function WeatherPageUI() {
  const [fontsLoaded] = useFonts({ Fredoka: require("../assets/fonts/Fredoka.ttf") });

  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [hourly, setHourly] = useState([]);
  const reminders = ["sunscreen", "sunglasses", "hat", "water bottle"];

  // Fetch weather data
  useEffect(() => {
    (async () => {
      try {
        const { current, hourly } = await fetchWeatherData();
        if (!current) throw new Error("No current weather");
        setCurrent(current);
        setHourly(hourly);
      } catch (e) {
        Alert.alert("Error", "Unable to fetch weather data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Get Date Label
  const date = useMemo(() => new Date(), []);
  const dateLabel = useMemo(
    () =>
      date.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [date]
  );

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.pageTitle}>Today’s weather</Text>

      <View style={styles.card}>
        {/* Date */}
        <Text style={styles.date}>
          {dateLabel} 
        </Text>

        {/* Hero */}
        <View style={styles.hero}>
          <Image source={current.icon} style={styles.weatherIcon} />
          <Text style={styles.temp}>
            {current.temp}
            <Text style={styles.deg}>°</Text>
          </Text>
        </View>
        <Text style={styles.condition}>{current.label}</Text>

        <View style={styles.divider} />

        {/* Forecast */}
        <View style={styles.subCard}>
          <Text style={styles.subTitle}>Today’s Forecast</Text>
          <FlatList
            horizontal
            data={hourly}
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourList}
            renderItem={({ item }) => (
              <View style={styles.hourBox}>
                <Text style={styles.hourText}>
                  {item.time}
                  <Text style={styles.periodText}> {item.period}</Text>
                </Text>
                <Image source={item.icon} style={styles.hourIcon} />
                <Text style={styles.hourTemp}>{item.temp}°</Text>
              </View>
            )}
          />
        </View>

        {/* Reminders */}
        <View style={[styles.subCard, { marginTop: 16 }]}>
          <View style={styles.reminderHeader}>
            <Text style={styles.subTitle}>Personal Reminders</Text>
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
              <Text style={styles.addText}>＋ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reminderList}>
            {reminders.map((item, i) => (
              <Text key={i} style={styles.bullet}>
                • <Text style={styles.bulletText}>{item}</Text>
              </Text>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E9E3D5",
    paddingTop: 8,
  },

  pageTitle: {
    fontFamily: "Fredoka",
    fontSize: 32,
    fontWeight: "900",
    color: "#5B3C2E",
    paddingHorizontal: 20,
    marginTop: 12,
  },

  card: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 36,
    paddingVertical: 28,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },

  date: {
    fontFamily: "Fredoka",
    textAlign: "center",
    fontSize: 22,
    color: "#5B3C2E",
    fontWeight: "900",
  },
  year: { color: "#5B3C2E", fontWeight: "900" },

  hero: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  weatherIcon: { width: 96, height: 96, resizeMode: "contain" },
  temp: {
    fontFamily: "Fredoka",
    fontSize: 100,
    color: "#E8A93A",
    fontWeight: "900",
    lineHeight: 100,
  },
  deg: { fontFamily: "Fredoka", fontSize: 48, color: "#5B3C2E" },
  condition: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 22,
    color: "#5B3C2E",
    fontWeight: "900",
  },

  divider: {
    height: 4,
    width: "86%",
    alignSelf: "center",
    backgroundColor: "#e6ddcf",
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 10,
    opacity: 0.9,
  },

  subCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#d8d4ce",
    padding: 14,
    marginTop: 6,
  },
  subTitle: {
    fontFamily: "Fredoka",
    fontSize: 20,
    color: "#5B3C2E",
    fontWeight: "900",
    marginBottom: 6,
  },

  hourList: { paddingVertical: 6 },
  hourBox: {
    width: 76,
    marginRight: 10,
    alignItems: "center",
    backgroundColor: "#FAF8F6",
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEE6DC",
  },
  hourText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: "#5B3C2E",
    fontWeight: "900",
  },
  periodText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#5B3C2E",
    opacity: 0.85,
  },
  hourIcon: { width: 28, height: 28, resizeMode: "contain", marginVertical: 6 },
  hourTemp: {
    fontFamily: "Fredoka",
    color: "#5B3C2E",
    fontWeight: "900",
    fontSize: 16,
  },

  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addBtn: {
    backgroundColor: "#E0916C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  addText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
    fontFamily: "Fredoka",
  },

  reminderList: { marginTop: 4 },
  bullet: { marginTop: 8, paddingLeft: 6 },
  bulletText: {
    color: "#5B3C2E",
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "Fredoka",
  },
});
