import type {
  GeocodingResponse,
  WeatherData,
} from "../types/weather";

const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast";

const GEOCODING_API_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCity(
  city: string
): Promise<GeocodingResponse> {
  const url = new URL(GEOCODING_API_URL);

  url.searchParams.set("name", city);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to search for city."
    );
  }

  return response.json();
}

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = new URL(WEATHER_API_URL);

  url.searchParams.set(
    "latitude",
    latitude.toString()
  );

  url.searchParams.set(
    "longitude",
    longitude.toString()
  );

  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "weather_code",
      "wind_speed_10m",
    ].join(",")
  );

  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "precipitation_probability_max",
    ].join(",")
  );

  url.searchParams.set(
    "temperature_unit",
    "celsius"
  );

  url.searchParams.set(
    "wind_speed_unit",
    "kmh"
  );

  url.searchParams.set(
    "timezone",
    "auto"
  );

  url.searchParams.set(
    "forecast_days",
    "7"
  );

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to fetch weather data."
    );
  }

  return response.json();
}

export function getWeatherDescription(
  weatherCode: number
): string {
  switch (weatherCode) {
    case 0:
      return "Clear sky";

    case 1:
      return "Mainly clear";

    case 2:
      return "Partly cloudy";

    case 3:
      return "Overcast";

    case 45:
    case 48:
      return "Foggy";

    case 51:
    case 53:
    case 55:
      return "Drizzle";

    case 56:
    case 57:
      return "Freezing drizzle";

    case 61:
    case 63:
    case 65:
      return "Rain";

    case 66:
    case 67:
      return "Freezing rain";

    case 71:
    case 73:
    case 75:
      return "Snow";

    case 77:
      return "Snow grains";

    case 80:
    case 81:
    case 82:
      return "Rain showers";

    case 85:
    case 86:
      return "Snow showers";

    case 95:
      return "Thunderstorm";

    case 96:
    case 99:
      return "Thunderstorm with hail";

    default:
      return "Unknown weather";
  }
}

export function getWeatherIcon(
  weatherCode: number
): string {
  switch (weatherCode) {
    case 0:
      return "☀️";

    case 1:
      return "🌤️";

    case 2:
      return "⛅";

    case 3:
      return "☁️";

    case 45:
    case 48:
      return "🌫️";

    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return "🌦️";

    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return "🌧️";

    case 71:
    case 73:
    case 75:
    case 77:
      return "❄️";

    case 80:
    case 81:
    case 82:
      return "🌦️";

    case 85:
    case 86:
      return "🌨️";

    case 95:
    case 96:
    case 99:
      return "⛈️";

    default:
      return "🌡️";
  }
}