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

// module imports
import {
  subscribeToEventsForCurrentUser,
  deleteEventForCurrentUser,
} from "../modules/calendarEvents";
import TaskPopUp from "../components/TaskPopUp";

const COLORS = {
  pageBg: "#EFE6DE",
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

// 
const getDayNumber = (d) => d.getDate();
const getDayLabel = (d) =>
  d.toLocaleDateString("en-CA", { weekday: "short" }).toLowerCase();

// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_getter_methods
const toLocalYMD = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//fix for probem with timezones
const parseYMDToLocalDate = (ymd) => {
  const [yearStr, monthStr, dayStr] = ymd.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  return new Date(year, month - 1, day); 
};

const groupEventsByDay = (events) => {
  const map = {};
  events.forEach((e) => {
    const d = e.startDate || new Date();
    const key = toLocalYMD(d); // use local date string instead of toISOString
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
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handlePressEvent = (event) => {
    setSelectedEvent(event);
  };

  // remove event from firestore
  const handleRemoveEvent = async (eventToRemove) => {
    try {
      await deleteEventForCurrentUser(eventToRemove.id);
      setSelectedEvent(null);
    } catch (err) {
      console.warn("Failed to delete event", err);
    }
  };

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
      date: parseYMDToLocalDate(k), // use local date 
      events: eventsByDay[k],
    }));
  }, [eventsByDay]);

  const selectedKey = toLocalYMD(selectedDate);
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
      const key = toLocalYMD(d);
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

        {/* Month label and divider */}
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <View style={styles.divider} />

        {viewMode === "all" ? (
          // -------- ALL VIEW --------
          <FlatList
            data={allDays}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <AllDayRow
                date={item.date}
                events={item.events}
                onEventPress={handlePressEvent}
              />
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
            {/* List of days in week */}
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
            {/* list of tasks */}
            {selectedEvents.length === 0 ? (
              <Text style={styles.emptyText}>No tasks on this day.</Text>
            ) : (
              <FlatList
                data={selectedEvents}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => (
                  <EventPill
                    event={item}
                    index={index}
                    onPress={handlePressEvent}
                  />
                )}
              />
            )}
          </View>
        )}
      </View>

      <TaskPopUp
        visible={selectedEvent ? true : false}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRemove={handleRemoveEvent}
      />
    </View>
  );
}

// --- subcomponents ---

const AllDayRow = ({ date, events, onEventPress }) => {
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
          events.map((e, i) => (
            <EventPill
              key={e.id}
              event={e}
              index={i}
              onPress={onEventPress}
            />
          ))
        )}
      </View>
    </View>
  );
};

// different colours for pills
const EventPill = ({ event, index, onPress }) => {
  //  Doesnt need to be here but I dont want to change something that works right now
  const baseColors = [
    COLORS.eventGreen,
    COLORS.eventPink,
    COLORS.eventBlue,
    COLORS.eventBeige,
  ];

  //which category gets which colour
  const categoryColorMap = {
    School: COLORS.eventBlue,
    Work: COLORS.eventGreen,
    Personal: COLORS.eventPink,
    Other: COLORS.eventBeige,
  };

  const bg =
    (event.category && categoryColorMap[event.category]) ||
    baseColors[index % baseColors.length];

  return (
    <TouchableOpacity
      style={[styles.eventContainer, { backgroundColor: bg }]}
      activeOpacity={0.8}
      onPress={() => onPress && onPress(event)}
    >
      <Text style={styles.eventText}>{event.title}</Text>
    </TouchableOpacity>
  );
};

// --- styles --- (unchanged)
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
    marginTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: "Fredoka",
    fontSize: 35,
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
    fontSize: 20,
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
    alignSelf: "center",
    backgroundColor: COLORS.pillBg,
    borderRadius: 999,
    padding: 7,
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
    fontSize: 15,
    color: COLORS.headerText,
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "800",
  },
  monthLabel: {
    fontFamily: "Fredoka",
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.headerText,
    marginTop: 10,
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
    fontWeight: "500",
    color: COLORS.headerText,
  },
  dayLabel: {
    fontFamily: "Fredoka",
    fontSize: 15,
    color: COLORS.subtle,
  },
  dayRight: {
    flex: 1,
    gap: 8,
  },
  eventContainer: {
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  eventText: {
    fontFamily: "Fredoka",
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
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
    marginHorizontal: 15,
  },
  weekBubble: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
    width: 43,
    height: 57,
  },
  weekBubbleActive: {
    backgroundColor: COLORS.accent,
  },
  weekNumber: {
    fontFamily: "Fredoka",
    fontSize: 19,
    fontWeight: "500",
    color: COLORS.headerText,
  },
  weekNumberActive: {
    color: "#fff",
  },
  weekLabel: {
    fontFamily: "Fredoka",
    fontSize: 14,
    color: COLORS.subtle,
  },
  weekLabelActive: {
    color: "#fff",
  },
  tasksLabel: {
    fontFamily: "Fredoka",
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.headerText,
    marginTop: 4,
    marginBottom: 8,
  },
});
