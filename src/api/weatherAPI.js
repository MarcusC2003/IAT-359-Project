// used chat gpt to clean up comments

import * as Location from "expo-location";
import { Alert } from "react-native";

// Weather icons (will convert to svg later) 
console.log("weatherAPI loaded");

// Daytime weather icons
const weatherIcons = {
  clear: require("../assets/icons/weather/clear.png"),
  cloudy: require("../assets/icons/weather/cloudy.png"),
  drizzle: require("../assets/icons/weather/drizzle.png"),
  fog: require("../assets/icons/weather/fog.png"),
  partlyCloudy: require("../assets/icons/weather/partly-cloudy.png"),
  rain: require("../assets/icons/weather/rain.png"),
  snow: require("../assets/icons/weather/snow.png"),
  storm: require("../assets/icons/weather/storm.png"),
};

// Nighttime weather icons
const nightWeatherIcons = {
  clear: require("../assets/icons/weather/clear-night.png"),
  partlyCloudy: require("../assets/icons/weather/partly-cloudy-night.png"),
};

// ---------- Constants ----------
const SUNRISE_HOUR = 6;       // 6 AM
const SUNSET_HOUR = 18;       // 6 PM
const TIME_SLOTS = 23;        // Number of hourly forecast entries to display

/*
  - Get weather label and icon from weather code
  - Convert Open-Meteo weather codes to labels and icons
  - Params: code (number), isNight (boolean)
  - Return: { label: string, icon: icon }
*/
export function mapWeatherCode(code, isNight = false) {
  // Day/Night specific icons
  if (code === 0) {
    return {
      label: isNight ? "Clear Night" : "Sunny",
      icon: isNight ? nightWeatherIcons.clear : weatherIcons.clear,
    };
  }
  if ([1, 2, 3].includes(code)) {
    return {
      label: isNight ? "Partly Cloudy Night" : "Partly Cloudy",
      icon: isNight ? nightWeatherIcons.partlyCloudy : weatherIcons.partlyCloudy,
    };
  }

  if ([45, 48].includes(code)) return { label: "Fog", icon: weatherIcons.fog };
  if ([51, 53, 55].includes(code)) return { label: "Drizzle", icon: weatherIcons.drizzle };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { label: "Rain", icon: weatherIcons.rain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: weatherIcons.snow };
  if ([95, 96, 99].includes(code)) return { label: "Storm", icon: weatherIcons.storm };
  return { label: "Cloudy", icon: weatherIcons.cloudy };
}

/*
  - Weather API from https://open-meteo.com/
  - Params: User Location (lat, lon)
  - Returns: weather data --> URL string
*/
function buildUrl(latitude, longitude) {
  return (
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=sunrise,sunset` +
    `&timezone=auto`
  );
}

/*
  - location reference : https://docs.expo.dev/versions/latest/sdk/location/- 
  - Get location, fetch weather data, and parse response
  - Returns: { current, hourly } weather data
*/
export async function fetchWeatherData() {
  try {
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Enable location to get weather data.");
      return { current: null, hourly: [] };
    }

    // Get current location
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest, // more reliable and faster
    });

    // Fetch data from Open-Meteo
    const response = await fetch(buildUrl(coords.latitude, coords.longitude));
    if (!response.ok) throw new Error(`Open-Meteo error: ${response.status}`);
    const data = await response.json();

    // Check for missing data before continuing
    if (!data.current || !data.hourly || !data.daily) {
      throw new Error("Incomplete weather data from API.");
    }

    /* 
      - Get sunrise/sunset times for each day --> array
     */
    const sunByDay = {};
    if (data.daily?.time && data.daily?.sunrise && data.daily?.sunset) {
      for (let i = 0; i < data.daily.time.length; i++) {
        sunByDay[data.daily.time[i]] = {
          sunrise: new Date(data.daily.sunrise[i]).getTime(),
          sunset: new Date(data.daily.sunset[i]).getTime(),
        };
      }
    }

    /*
      - Function: Check if a given date/time is during the night
      - Params: targetDate (Date)
      - Return: boolean (true if night, false if day)
    */
    const isNightAt = (targetDate) => {
      const dateKey = targetDate.toISOString().slice(0, 10);
      const sunTimes = sunByDay[dateKey];

      // Fallback heuristic if sunrise/sunset missing
      if (!sunTimes) {
        const hour = targetDate.getHours();
        return hour < SUNRISE_HOUR || hour >= SUNSET_HOUR;
      }

      const timestamp = targetDate.getTime();
      return timestamp < sunTimes.sunrise || timestamp >= sunTimes.sunset;
    };

    /* ----- Current Weather ----- */
    const now = new Date();

    // Handle missing current data safely
    const temp =
      data.current?.temperature_2m !== undefined
        ? Math.round(data.current.temperature_2m)
        : "--";
    const code = data.current?.weather_code ?? 0;

    const { label, icon } = mapWeatherCode(code, isNightAt(now));
    const current = { temp, label, icon };

    /* ----- Hourly Forecast (all TIME_SLOTS slots) ----- */
    const times = data.hourly?.time || [];
    const temps = data.hourly?.temperature_2m || [];
    const codes = data.hourly?.weather_code || [];

    const nowMs = now.getTime();
    const startIdx = times.findIndex((t) => new Date(t).getTime() >= nowMs);

    const hourly = [];
    for (let i = startIdx; i < startIdx + TIME_SLOTS && i < times.length; i++) {
      const forecastDate = new Date(times[i]);

      // Convert to 12-hour format (AM/PM)
      let hour = forecastDate.getHours();
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;

      const { icon: hourIcon } = mapWeatherCode(codes[i], isNightAt(forecastDate));
      hourly.push({
        time: hour,
        period,
        icon: hourIcon,
        temp: Math.round(temps[i]),
      });
    }

    // Return parsed weather data
    return { current, hourly };
  } catch (err) {
    // Handle API or location errors 
    Alert.alert("Error", err.message || "Failed to load weather data.");
    console.error("fetchWeatherData error:", err);
    return { current: null, hourly: [] };
  }
}
