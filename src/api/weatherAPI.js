import * as Location from "expo-location";
import { Alert } from "react-native";
// Weather icons --> will convert to svg later
console.log("weatherAPI loaded");

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
const nightWeatherIcons = {
  clear: require("../assets/icons/weather/clear-night.png"),
  partlyCloudy: require("../assets/icons/weather/partly-cloudy-night.png"),
};

// Get weather label and icon from weather code
// Convert Open-Meteo weather codes to labels and icons
// Params: code (number), isNight (boolean)
// Return: { label: string, icon: icon }
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

// Weather API from https://open-meteo.com/
// Params: User Location (lat, lon)
// Returns: weather data --> URL string
function buildUrl(lat, lon) {
  return (
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=sunrise,sunset` +
    `&timezone=auto`
  );
}

// Get Weather Data from Open Meteo
// Returns: weather data --> URL string
export async function fetchWeatherData() {
  try {
    // Request 
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

    if (!data.current || !data.hourly || !data.daily) {
      throw new Error("Incomplete weather data from API.");
    }

    /* ----- Build sunrise/sunset lookup by day ----- */
    const sunByDay = {};
    if (data.daily?.time && data.daily?.sunrise && data.daily?.sunset) {
      for (let i = 0; i < data.daily.time.length; i++) {
        sunByDay[data.daily.time[i]] = {
          sunrise: new Date(data.daily.sunrise[i]).getTime(),
          sunset: new Date(data.daily.sunset[i]).getTime(),
        };
      }
    }

    // Function:  Check if night 
    // returns: boolean
    const isNightAt = (dateObj) => {
      const dayKey = dateObj.toISOString().slice(0, 10);
      const meta = sunByDay[dayKey];
      if (!meta) {
        // Fallback heuristic if sunrise/sunset missing
        const h = dateObj.getHours();
        return h < 6 || h >= 18;
      }
      const t = dateObj.getTime();
      return t < meta.sunrise || t >= meta.sunset;
    };

    /* ----- Current ----- */
    const now = new Date();

    const temp =
      data.current?.temperature_2m !== undefined
        ? Math.round(data.current.temperature_2m)
        : "--";
    const code = data.current?.weather_code ?? 0;

    const { label, icon } = mapWeatherCode(code, isNightAt(now));
    const current = { temp, label, icon };

    /* ----- Hourly (next 23 slots from "now") ----- */
    const times = data.hourly?.time || [];
    const temps = data.hourly?.temperature_2m || [];
    const codes = data.hourly?.weather_code || [];

    const nowMs = now.getTime();
    const startIdx = times.findIndex((t) => new Date(t).getTime() >= nowMs);

    const hourly = [];
    for (let i = startIdx; i < startIdx + 23 && i < times.length; i++) {
      const d = new Date(times[i]);
      let hour = d.getHours();
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;

      const { icon: hourIcon } = mapWeatherCode(codes[i], isNightAt(d));
      hourly.push({
        time: hour,
        period,
        icon: hourIcon,
        temp: Math.round(temps[i]),
      });
    }

    return { current, hourly };
  } catch (err) {
    Alert.alert("Error", err.message || "Failed to load weather data.");
    console.error("fetchWeatherData error:", err);
    return { current: null, hourly: [] };
  }
}
