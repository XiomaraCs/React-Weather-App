import type {
  WeatherData,
  TemperatureUnit,
} from "../types/weather";

import {
  getWeatherDescription,
  getWeatherIcon,
} from "../services/weatherApi";

interface CurrentWeatherProps {
  city: string;
  weather: WeatherData;
  unit: TemperatureUnit;
}

function CurrentWeather({
  city,
  weather,
  unit,
}: CurrentWeatherProps) {
  function convertTemperature(
    temperature: number
  ): number {
    if (unit === "C") {
      return temperature;
    }

    return (temperature * 9) / 5 + 32;
  }

  const temperature =
    convertTemperature(
      weather.current.temperature_2m
    );

  const weatherCode =
    weather.current.weather_code;

  const description =
    getWeatherDescription(weatherCode);

  const icon =
    getWeatherIcon(weatherCode);

  return (
    <section
      className="current-weather"
      aria-label="Current weather"
    >
      <h2>{city}</h2>

      <div className="current-icon">
        {icon}
      </div>

      <h3>
        {temperature.toFixed(1)}°{unit}
      </h3>

      <p className="current-condition">
        {description}
      </p>

      <div className="weather-details">
        <div className="weather-detail">
          <span>💧</span>
          <p>
            Humidity
          </p>
          <strong>
            {weather.current
              .relative_humidity_2m}
            %
          </strong>
        </div>

        <div className="weather-detail">
          <span>💨</span>
          <p>
            Wind
          </p>
          <strong>
            {weather.current
              .wind_speed_10m}{" "}
            km/h
          </strong>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;