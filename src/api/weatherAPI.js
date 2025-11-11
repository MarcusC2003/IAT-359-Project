import * as Location from "expo-location";
import { Alert } from "react-native";

// Weather icons --> will convert to svg later
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

// Constants
const SUNRISE_HOUR = 6;
const SUNSET_HOUR = 18;
const TIME_SLOTS = 23; // Next 23 hours --> used for hourly forecast cards
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
function buildUrl(lat, lon) {
  return (
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=sunrise,sunset` +
    `&timezone=auto`
  );
}
/*
  - Resources: 
    - Expo Location setup --> https://allxone.vn/expo-gps-location-guide/#:~:text=Open%20Android%20Studio%2C%20and%20launch%20your%20AVD,%E2%80%9CMore%E2%80%9D%20and%20navigate%20to%20the%20%E2%80%9CLocation%E2%80%9D%20tab
    - Open-Meteo Format ex.
      {
        "hourly": {
        "time": ["2022-07-01T00:00","2022-07-01T01:00", ...],
        "wind_speed_10m": [3.16,3.02,3.3,3.14,3.2,2.95, ...],
        "temperature_2m": [13.7,13.3,12.8,12.3,11.8, ...],
        "relative_humidity_2m": [82,83,86,85,88,88,84,76, ...],
      }
  - Get location , fetch weather data, parse response
  - Returns: weather data --> URL string
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
    const { coords } = await Location.getCurrentPositionAsync({});
    const response = await fetch(buildUrl(coords.latitude, coords.longitude));
    if (!response.ok) throw new Error(`Open-Meteo error: ${response.status}`);
    const data = await response.json();

    // Function: Separate sunrise/sunset by day for night detection (for switching icons)
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
    const isNightTime = (targetDate) => {
      const dateKey = targetDate.toISOString().slice(0, 10); // ex. "2025-03-19"
      const sunTimes = sunByDay[dateKey];                    // { ex. sunrise: 07:12, sunset: 19:18 }

      // If data missing, assume night between 6 PM - 6 AM
      if (!sunTimes) {
        const hour = targetDate.getHours();
        return hour < SUNRISE_HOUR || hour >= SUNSET_HOUR;
      }
      const timestamp = targetDate.getTime();
      return timestamp < sunTimes.sunrise || timestamp >= sunTimes.sunset;
    };


    // Get Current Weather --> Separated in case we want to add more data later
    const now = new Date();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const { label, icon } = mapWeatherCode(code, isNightAt(now));
    const current = { temp, label, icon };

    const times = data.hourly.time;
    const temps = data.hourly.temperature_2m;
    const codes = data.hourly.weather_code;

  
    const nowMs = now.getTime(); // Current time in milliseconds
    const startIdx = times.findIndex((t) => new Date(t).getTime() >= nowMs);

    // Build hourly forecast array --> next 23 hours
    const hourly = [];
    for (let i = startIdx; i < startIdx + TIME_SLOTS && i < times.length; i++) {
      const d = new Date(times[i]);
      
      // 12-hour format (AM/PM)
      let hour = d.getHours();
      const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;

      const { icon: hourIcon } = mapWeatherCode(codes[i], isNightAt(d));
      hourly.push({ time: hour, period, icon: hourIcon, temp: Math.round(temps[i]) });
    }

    return { current, hourly };
  } catch (err) {
    Alert.alert("Failed to load weather data.");
    return { current: null, hourly: [] };
  }
}
