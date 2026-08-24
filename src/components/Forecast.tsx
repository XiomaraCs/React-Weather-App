import type {
  WeatherData,
  TemperatureUnit,
} from "../types/weather";

import {
  getWeatherDescription,
  getWeatherIcon,
} from "../services/weatherApi";

function formatDay(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface ForecastProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

function Forecast({
  weather,
  unit,
}: ForecastProps) {
  function convertTemperature(
    temperature: number
  ): number {
    if (unit === "C") {
      return temperature;
    }

    return (temperature * 9) / 5 + 32;
  }

  return (
    <section className="forecast">
      <h2>7-Day Forecast</h2>

      <div className="forecast-grid">
        {weather.daily.time.map(
          (date, index) => {
            const high = convertTemperature(
              weather.daily
                .temperature_2m_max[index]
            );

            const low = convertTemperature(
              weather.daily
                .temperature_2m_min[index]
            );

            const weatherCode =
              weather.daily.weather_code[index];

            const precipitation =
              weather.daily
                .precipitation_probability_max[
                index
              ];

            return (
              <div
                className="forecast-card"
                key={date}
              >
                <h3>{formatDay(date)}</h3>

                <p className="forecast-date">
                  {formatDate(date)}
                </p>

                <div className="forecast-icon">
                  {getWeatherIcon(
                    weatherCode
                  )}
                </div>

                <p>
                  {getWeatherDescription(
                    weatherCode
                  )}
                </p>

                <p>
                  <strong>
                    {high.toFixed(1)}°{unit}
                  </strong>
                </p>

                <p>
                  Low: {low.toFixed(1)}°{unit}
                </p>

                <p>
                  💧 {precipitation}%
                </p>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}

export default Forecast;