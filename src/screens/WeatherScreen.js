import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '../../assets/components/NavBar';

export default function WeatherPageUI() {
  // Create Day Value
  const today = useMemo(() => new Date(), []);
  const dateLabel = useMemo(
    () => today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }),
    [today]
  );

  const current = { temp: 24, label: 'Sunny', emoji: '☀️' };
  const hourly = [
    { t: '1', meridiem: 'AM', emoji: '☀️', temp: 12 },
    { t: '2', meridiem: 'AM', emoji: '🌥️', temp: 8 },
    { t: '3', meridiem: 'AM', emoji: '☁️', temp: 3 },
    { t: '4', meridiem: 'AM', emoji: '☁️', temp: 4 },
    { t: '5', meridiem: 'AM', emoji: '🌤️', temp: 5 },
  ];
  const reminders = ['sunscreen', 'sunglasses', 'hat', 'water bottle'];
  // -----------------------------------

  return (
      <SafeAreaView style={styles.background}>
      {/* Main card */}
      <View style={styles.card}>
        <Text style={styles.dateText}>
          {dateLabel} <Text style={styles.year}>{today.getFullYear()}</Text>
        </Text>

        <View style={styles.heroRow}>
          <Text style={styles.bigEmoji}>{current.emoji}</Text>
          <Text style={styles.bigTemp}>
            {current.temp}
            <Text style={styles.deg}>°</Text>
          </Text>
        </View>

        <Text style={styles.condition}>{current.label}</Text>

        <View style={styles.divider} />

        {/* Forecast card */}
        <View style={styles.subCard}>
          <Text style={styles.subTitle}>Today’s Forecast</Text>
          <FlatList
            horizontal
            data={hourly}
            keyExtractor={(it, i) => `${i}-${it.t}${it.meridiem}`}
            contentContainerStyle={{ paddingVertical: 6 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.hourCol}>
                <Text style={styles.hourTop}>
                  {item.t}
                  <Text style={styles.amPm}> {item.meridiem}</Text>
                </Text>
                <Text style={styles.hourEmoji}>{item.emoji}</Text>
                <Text style={styles.hourTemp}>{item.temp}°</Text>
              </View>
            )}
          />
        </View>

        {/* Reminders card */}
        <View style={[styles.subCard, { marginTop: 18 }]}>
          <View style={styles.reminderHeader}>
            <Text style={styles.subTitle}>Personal Reminders</Text>
            <TouchableOpacity style={styles.addPill} activeOpacity={0.8}>
              <Text style={styles.addPillText}>＋Add</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            {reminders.map((r, i) => (
              <Text key={i} style={styles.bullet}>
                • <Text style={styles.bulletText}>{r}</Text>
              </Text>
            ))}
          </View>
        </View>
      </View>
      <NavBar page="weather" />
      </SafeAreaView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  // layout & theme
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 26,
    backgroundColor:'#E9E3D5',
  },
  brandBrown: { color: '#5B3C2E' },
  brandAccent: { color: '#E0916C' },

  // header
  header: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 18,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    color: '#5B3C2E',
    fontWeight: '900',
  },
  catBadge: {
    width: 56,
    height: 56,
    backgroundColor: '#E0916C',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  catIcon: { width: 34, height: 34, resizeMode: 'contain' },

  // main card
  card: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },

  dateText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#5B3C2E',
    fontWeight: '800',
  },
  year: { color: '#5B3C2E', fontWeight: '700' },

  heroRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  bigEmoji: { fontSize: 64 },
  bigTemp: {
    fontSize: 82,
    color: '#E8A93A',
    fontWeight: '900',
    lineHeight: 84,
  },
  deg: { color: '#5B3C2E' },
  condition: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 18,
    color: '#5B3C2E',
    fontWeight: '800',
  },

  divider: {
    height: 4,
    width: '86%',
    alignSelf: 'center',
    backgroundColor: '#e6ddcf',
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 10,
    opacity: 0.8,
  },

  // mini-cards
  subCard: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#d8d4ce',
    padding: 14,
    marginTop: 6,
  },
  subTitle: {
    fontSize: 20,
    color: '#5B3C2E',
    fontWeight: '900',
    marginBottom: 4,
  },

  // hourly tiles
  hourCol: {
    width: 70,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#faf8f6',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee6dc',
  },
  hourTop: {
    color: '#5B3C2E',
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  amPm: { fontSize: 12, fontWeight: '800', color: '#5B3C2E', opacity: 0.85 },
  hourEmoji: { fontSize: 20, marginVertical: 4 },
  hourTemp: { color: '#5B3C2E', fontWeight: '900' },

  // reminders
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addPill: {
    backgroundColor: '#E0916C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  addPillText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  bullet: { marginTop: 8, paddingLeft: 6 },
  bulletText: {
    color: '#5B3C2E',
    fontSize: 16,
    fontWeight: '900',
  },
});
