import { useEffect, useState } from "react";

import SearchBar from "./components/SearchBar";
import Forecast from "./components/Forecast";
import CurrentWeather from "./components/CurrentWeather";

import "./App.css";

import {
  getWeather,
  searchCity,
} from "./services/weatherApi";

import type {
  WeatherData,
  TemperatureUnit,
} from "./types/weather";

function App() {
  const [city, setCity] = useState("");

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [unit, setUnit] =
    useState<TemperatureUnit>("C");

  const [darkMode, setDarkMode] = useState(() => {
    const saved =
      localStorage.getItem("darkMode");

    return saved === "true";
  });

  const [recentSearches, setRecentSearches] =
    useState<string[]>(() => {
      const saved =
        localStorage.getItem("recentSearches");

      return saved ? JSON.parse(saved) : [];
    });

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      String(darkMode)
    );
  }, [darkMode]);

  async function handleSearch() {
    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const locationData = await searchCity(city);

      if (
        !locationData.results ||
        locationData.results.length === 0
      ) {
        setError("City not found.");
        setWeather(null);
        return;
      }

      const location = locationData.results[0];

      const weatherData = await getWeather(
        location.latitude,
        location.longitude
      );

      setWeather(weatherData);

      const updatedSearches = [
        city.trim(),
        ...recentSearches.filter(
          (item) =>
            item.toLowerCase() !==
            city.trim().toLowerCase()
        ),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);

      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to fetch weather data."
      );

      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecentSearch(
    recentCity: string
  ) {
    setCity(recentCity);
    setLoading(true);
    setError("");

    try {
      const locationData =
        await searchCity(recentCity);

      if (
        !locationData.results ||
        locationData.results.length === 0
      ) {
        setError("City not found.");
        setWeather(null);
        return;
      }

      const location = locationData.results[0];

      const weatherData = await getWeather(
        location.latitude,
        location.longitude
      );

      setWeather(weatherData);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to fetch weather data."
      );

      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weatherData = await getWeather(
            position.coords.latitude,
            position.coords.longitude
          );

          setWeather(weatherData);
          setCity("Your Location");
        } catch (error) {
          console.error(error);

          setError(
            "Unable to get weather for your location."
          );

          setWeather(null);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        if (error.code === 1) {
          setError(
            "Location permission was denied. Please allow location access in your browser settings."
          );
        } else if (error.code === 2) {
          setError(
            "Your location could not be determined."
          );
        } else if (error.code === 3) {
          setError(
            "Location request timed out. Please try again."
          );
        } else {
          setError(
            "Unable to determine your location."
          );
        }

        setLoading(false);
      }
    );
  }

  function toggleDarkMode() {
    setDarkMode((currentMode) => !currentMode);
  }

  return (
    <main
      className={`app ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <div className="app-container">
        <header className="app-header">
          <h1>🌤️ Weather App</h1>

          <p>
            Check the weather anywhere in the world
          </p>
        </header>

        <button
          type="button"
          className="theme-button"
          onClick={toggleDarkMode}
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>

        <SearchBar
          city={city}
          loading={loading}
          onCityChange={setCity}
          onSearch={handleSearch}
        />

        <button
          type="button"
          className="location-button"
          onClick={handleUseLocation}
          disabled={loading}
        >
          📍 Use My Location
        </button>

        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <p>Recent searches</p>

            <div className="recent-search-list">
              {recentSearches.map(
                (recentCity) => (
                  <button
                    type="button"
                    key={recentCity}
                    onClick={() =>
                      handleRecentSearch(
                        recentCity
                      )
                    }
                    disabled={loading}
                  >
                    {recentCity}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="unit-buttons">
          <button
            type="button"
            className={
              unit === "C" ? "active" : ""
            }
            onClick={() => setUnit("C")}
          >
            °C
          </button>

          <button
            type="button"
            className={
              unit === "F" ? "active" : ""
            }
            onClick={() => setUnit("F")}
          >
            °F
          </button>
        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {loading && (
          <div className="loading-message">
            <div className="loading-spinner"></div>

            <p>
              Getting the latest weather...
            </p>
          </div>
        )}

        {weather && !loading && (
          <>
            <CurrentWeather
              city={city}
              weather={weather}
              unit={unit}
            />

            <Forecast
              weather={weather}
              unit={unit}
            />
          </>
        )}

        {!weather &&
          !loading &&
          !error && (
            <div className="empty-state">
              <div>🌎</div>

              <h2>Search for a city</h2>

              <p>
                Enter a city above to see the
                current weather and 7-day forecast.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}

export default App;