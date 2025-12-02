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
    TextInput,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWeatherData } from "../api/weatherAPI";

const WEATHER_ACTIONS = {
    Clear: ["Apply Sunscreen (high UV)", "Drink extra water (stay hydrated)"],
    Rain: ["Grab an umbrella", "Wear waterproof shoes or boots"],
    Cloudy: ["Take a jacket or light layer", "Don't forget vitamin D supplements"],
    Snow: ["Wear warm, insulated layers", "Check local road conditions"],
    Default: ["Check the forecast later", "Wear comfortable layers"],
};

// Define a constant key for AsyncStorage
const REMINDER_STORAGE_KEY = '@weather_custom_reminders'; 

export default function WeatherPageUI() {
    const [fontsLoaded] = useFonts({ Fredoka: require("../assets/fonts/Fredoka.ttf") });

    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(null);
    const [hourly, setHourly] = useState([]);
    
    // Initial state is now an empty array, data will be loaded from storage
    const [customReminders, setCustomReminders] = useState([]); 
    const [newReminderText, setNewReminderText] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [weatherLoading, setWeatherLoading] = useState(true); // Separate loading state for weather API

    // --- 1. Load Reminders from AsyncStorage on Mount ---
    useEffect(() => {
        const loadReminders = async () => {
            try {
                const storedReminders = await AsyncStorage.getItem(REMINDER_STORAGE_KEY);
                if (storedReminders !== null) {
                    setCustomReminders(JSON.parse(storedReminders));
                }
            } catch (e) {
                console.error("Failed to load reminders from storage:", e);
            }
        };
        
        loadReminders();
        
        // Fetch Weather Data (moved inside useEffect but kept async IIFE logic)
        (async () => {
            try {
                const { current: fetchedCurrent, hourly: fetchedHourly } = await fetchWeatherData();
                if (!fetchedCurrent) throw new Error("No current weather");
                
                setCurrent(fetchedCurrent);
                setHourly(fetchedHourly);
            } catch (e) {
                Alert.alert("Error", "Unable to fetch weather data");
            } finally {
                setWeatherLoading(false);
            }
        })();
    }, []);

    // --- 2. Save Reminders to AsyncStorage whenever customReminders changes ---
    useEffect(() => {
        const saveReminders = async () => {
            try {
                await AsyncStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(customReminders));
            } catch (e) {
                console.error("Failed to save reminders to storage:", e);
            }
        };

        if (customReminders.length > 0 || customReminders.length === 0) {
             saveReminders();
        }
        
    }, [customReminders]);


    const suggestedActions = useMemo(() => {
        if (!current || !current.label) return WEATHER_ACTIONS.Default;
        
        const condition = current.label.split(' ')[0];
        return WEATHER_ACTIONS[condition] || WEATHER_ACTIONS.Default;
    }, [current]);

    const handleAddReminder = () => {
        const text = newReminderText.trim();
        if (text.length > 0) {
            // Note: use a unique key if you ever need to delete them
            setCustomReminders(prev => [...prev, text]); 
            setNewReminderText('');
            setIsAdding(false);
            Keyboard.dismiss();
        } else {
            Alert.alert("Input Required", "Please enter a reminder.");
        }
    };

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

    // Consolidated Loading Check
    if (!fontsLoaded || weatherLoading) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }
    
    const allReminders = [...suggestedActions, ...customReminders];

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
                        <TouchableOpacity 
                            style={styles.addBtn} 
                            activeOpacity={0.8}
                            onPress={() => setIsAdding(!isAdding)}
                        >
                            <Text style={styles.addText}>{isAdding ? '— Cancel' : '＋ Add'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Add New Reminder Input */}
                    {isAdding && (
                        <View style={styles.addInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="E.g., Check for traffic"
                                value={newReminderText}
                                onChangeText={setNewReminderText}
                                onSubmitEditing={handleAddReminder}
                                returnKeyType="done"
                            />
                            <TouchableOpacity 
                                style={styles.saveBtn}
                                onPress={handleAddReminder}
                            >
                                <Text style={styles.saveBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Combined Reminder List */}
                    <View style={styles.reminderList}>
                        {allReminders.length > 0 ? (
                            allReminders.map((item, i) => (
                                <Text key={i} style={styles.bullet}>
                                    • <Text style={styles.bulletText}>{item}</Text>
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.emptyReminderText}>No suggested actions or custom reminders.</Text>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#EFE6DE",
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
    addInputContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        gap: 8,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#FAF8F6',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        fontFamily: "Fredoka",
        borderWidth: 1,
        borderColor: "#d8d4ce",
    },
    saveBtn: {
        backgroundColor: '#5B3C2E',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        justifyContent: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 16,
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
    emptyReminderText: {
        color: "#8a8a8a",
        fontSize: 14,
        padding: 10,
        textAlign: 'center',
    }
});