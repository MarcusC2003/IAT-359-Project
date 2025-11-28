// src/screens/CalendarScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import { subscribeToEventsForCurrentUser } from "../modules/calendarEvents";

const COLORS = {
  pageBg: "#E6D7C9", // beige background
  cardBg: "#FFFFFF",
  headerText: "#5c3a2c",
  accent: "#E0916C",
  pillBg: "#F7E4D5",
  pillActive: "#E0916C",
  divider: "#E7DDCF",
  eventGreen: "#4DAF6F",
  eventPink: "#F3B5B5",
  eventBlue: "#8CA7CF",
  eventBeige: "#E9DFC9",
  subtle: "#B39A84",
};

const formatMonth = (date) =>
  date.toLocaleDateString("en-CA", { month: "long" });

const getDayNumber = (d) => d.getDate();
const getDayLabel = (d) =>
  d.toLocaleDateString("en-CA", { weekday: "short" }).toLowerCase();

const groupEventsByDay = (events) => {
  const map = {};
  events.forEach((e) => {
    const d = e.startDate || new Date();
    const key = d.toISOString().slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  });
  return map;
};

export default function CalendarScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Fredoka: require("../assets/fonts/Fredoka.ttf"),
  });

  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState("all"); // "all" | "week"
  const [selectedDate, setSelectedDate] = useState(new Date());

  // subscribe to Firestore
  useEffect(() => {
    const unsub = subscribeToEventsForCurrentUser(setEvents);
    return () => unsub();
  }, []);

  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  const allDays = useMemo(() => {
    const keys = Object.keys(eventsByDay).sort();
    return keys.map((k) => ({
      key: k,
      date: new Date(k),
      events: eventsByDay[k],
    }));
  }, [eventsByDay]);

  const selectedKey = selectedDate.toISOString().slice(0, 10);
  const selectedEvents = eventsByDay[selectedKey] || [];

  const weekDays = useMemo(() => {
    const base = new Date(selectedDate);
    const day = base.getDay(); // 0–6 (Sun=0)
    const diff = (day + 6) % 7; // Monday-start
    const monday = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() - diff
    );
    return [...Array(7)].map((_, i) => {
      const d = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i
      );
      const key = d.toISOString().slice(0, 10);
      return { key, date: d, events: eventsByDay[key] || [] };
    });
  }, [selectedDate, eventsByDay]);

  if (!fontsLoaded) return null;

  const monthBase = events[0]?.startDate || new Date();
  const monthLabel = formatMonth(
    monthBase instanceof Date ? monthBase : new Date(monthBase)
  );

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateTask")}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Rounded main card */}
      <View style={styles.card}>
        {/* All / Week toggle */}
        <View style={styles.toggleRow}>
          {["all", "week"].map((mode) => {
            const active = viewMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.togglePill,
                  active && styles.togglePillActive,
                ]}
                onPress={() => setViewMode(mode)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    active && styles.toggleTextActive,
                  ]}
                >
                  {mode === "all" ? "All" : "Week"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Month label + divider */}
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.divider} />

        {viewMode === "all" ? (
          // -------- ALL VIEW --------
          <FlatList
            data={allDays}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <AllDayRow date={item.date} events={item.events} />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No tasks yet. Tap + Add to create one.
              </Text>
            }
          />
        ) : (
          // -------- WEEK VIEW --------
          <View style={{ flex: 1 }}>
            {/* Date strip */}
            <View style={styles.weekStrip}>
              {weekDays.map((w) => {
                const isSelected = w.key === selectedKey;
                return (
                  <TouchableOpacity
                    key={w.key}
                    style={[
                      styles.weekBubble,
                      isSelected && styles.weekBubbleActive,
                    ]}
                    onPress={() => setSelectedDate(w.date)}
                  >
                    <Text
                      style={[
                        styles.weekNumber,
                        isSelected && styles.weekNumberActive,
                      ]}
                    >
                      {getDayNumber(w.date)}
                    </Text>
                    <Text
                      style={[
                        styles.weekLabel,
                        isSelected && styles.weekLabelActive,
                      ]}
                    >
                      {getDayLabel(w.date)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.tasksLabel}>Tasks</Text>

            {selectedEvents.length === 0 ? (
              <Text style={styles.emptyText}>No tasks on this day.</Text>
            ) : (
              <FlatList
                data={selectedEvents}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => (
                  <EventPill event={item} index={index} />
                )}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// --- subcomponents ---

const AllDayRow = ({ date, events }) => {
  return (
    <View style={styles.dayRow}>
      <View style={styles.dayLeft}>
        <Text style={styles.dayNumber}>{getDayNumber(date)}</Text>
        <Text style={styles.dayLabel}>{getDayLabel(date)}</Text>
      </View>

      <View style={styles.dayRight}>
        {events.length === 0 ? (
          <Text style={styles.smallMuted}>No tasks</Text>
        ) : (
          events.map((e, i) => <EventPill key={e.id} event={e} index={i} />)
        )}
      </View>
    </View>
  );
};

const EventPill = ({ event, index }) => {
  const colors = [
    COLORS.eventGreen,
    COLORS.eventPink,
    COLORS.eventBlue,
    COLORS.eventBeige,
  ];
  const bg = colors[index % colors.length];

  return (
    <View style={[styles.eventPill, { backgroundColor: bg }]}>
      <Text style={styles.eventText}>{event.title}</Text>
    </View>
  );
};

// --- styles ---

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontFamily: "Fredoka",
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.headerText,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  addButtonText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: "#fff",
    fontWeight: "800",
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: COLORS.pillBg,
    borderRadius: 999,
    padding: 4,
  },
  togglePill: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 999,
  },
  togglePillActive: {
    backgroundColor: COLORS.pillActive,
  },
  toggleText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: COLORS.headerText,
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "800",
  },
  monthLabel: {
    fontFamily: "Fredoka",
    fontSize: 22,
    color: COLORS.headerText,
    marginTop: 16,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.divider,
    marginTop: 6,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 16,
  },
  dayRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  dayLeft: {
    width: 70,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  dayNumber: {
    fontFamily: "Fredoka",
    fontSize: 24,
    color: COLORS.headerText,
  },
  dayLabel: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: COLORS.subtle,
  },
  dayRight: {
    flex: 1,
    gap: 8,
  },
  eventPill: {
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  eventText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },
  smallMuted: {
    fontFamily: "Fredoka",
    fontSize: 12,
    color: COLORS.subtle,
  },
  emptyText: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: COLORS.subtle,
    textAlign: "center",
    marginTop: 24,
  },
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  weekBubble: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 20,
  },
  weekBubbleActive: {
    backgroundColor: COLORS.accent,
  },
  weekNumber: {
    fontFamily: "Fredoka",
    fontSize: 16,
    color: COLORS.headerText,
  },
  weekNumberActive: {
    color: "#fff",
  },
  weekLabel: {
    fontFamily: "Fredoka",
    fontSize: 12,
    color: COLORS.subtle,
  },
  weekLabelActive: {
    color: "#fff",
  },
  tasksLabel: {
    fontFamily: "Fredoka",
    fontSize: 18,
    color: COLORS.headerText,
    marginTop: 4,
    marginBottom: 8,
  },
});
