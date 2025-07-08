/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "react-lottie-player";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";
import { getWeatherIconName } from "./utils/weatherIcons";
import "./index.css";
// import loadingAnimation from "./assets/loading.json"; // ← replace with your Lottie file

const cities = [
  "Amaravati",
  "Itanagar",
  "Dispur",
  "Patna",
  "Raipur",
  "Panaji",
  "Gandhinagar",
  "Chandigarh",
  "Shimla",
  "Ranchi",
  "Bengaluru",
  "Thiruvananthapuram",
  "Bhopal",
  "Mumbai",
  "Imphal",
  "Shillong",
  "Aizawl",
  "Kohima",
  "Bhubaneswar",
  "Jaipur",
  "Gangtok",
  "Chennai",
  "Hyderabad",
  "Agartala",
  "Lucknow",
  "Dehradun",
  "Kolkata",
  "Port Blair",
  "Daman",
  "New Delhi",
  "Srinagar",
  "Jammu",
  "Leh",
  "Kavaratti",
  "Puducherry",
];

const renderIcon = (name) => {
  switch (name) {
    case "cloudy":
      return <WiCloudy size={48} />;
    case "rain":
      return <WiRain size={48} />;
    case "thunderstorm":
      return <WiThunderstorm size={48} />;
    case "snow":
      return <WiSnow size={48} />;
    case "fog":
      return <WiFog size={48} />;
    default:
      return <WiDaySunny size={48} />;
  }
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [filteredCities, setFilteredCities] = useState(cities);

  const fetchWeather = async (cityName = city) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) {
        setError("City not found");
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Something went wrong", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (selectedCity) => {
    setCity(selectedCity);
    fetchWeather(selectedCity);
    setShowSidebar(false); // auto-close sidebar on mobile
  };

  useEffect(() => {
    if (!city) {
      setFilteredCities(cities);
    } else {
      setFilteredCities(
        cities.filter((c) => c.toLowerCase().startsWith(city.toLowerCase()))
      );
    }
  }, [city]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row transition-all duration-500 bg-gradient-to-br from-blue-400 via-blue-300 to-slate-200 text-gray-900">
      {/* Mobile Topbar */}
      {/* <div className="md:hidden flex justify-between items-center p-4 bg-black/30 text-white">
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? "✖️ Close" : "📍 Cities"}
        </button>
      </div> */}

      {/* Sidebar */}
      {/* <aside
        className={`$
          showSidebar ? "block" : "hidden"
        } md:block w-44 min-w-[140px] max-h-screen overflow-y-auto p-4 bg-black/20 text-white space-y-2 scrollbar-thin scrollbar-thumb-white/30`}
      >
        <h2 className="text-lg font-bold mb-3">Cities</h2>
        {filteredCities.map((c) => (
          <button
            key={c}
            onClick={() => handleCityClick(c)}
            className="w-full text-left px-3 py-2 rounded hover:bg-white/10 transition"
          >
            {c}
          </button>
        ))}
      </aside> */}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-white/80 text-black backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-md w-full text-center transition">
          <div className="flex justify-between mb-4">
            <h1 className="text-3xl font-bold">🌦 Weather App</h1>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2 rounded-md text-black focus:outline-none border border-gray-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchWeather()}
              className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-300 transition font-semibold shadow"
            >
              🔍 Search
            </motion.button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <Lottie
                loop
                animationData={null} // Replace with your loading JSON
                play
                style={{ width: 100, height: 100 }}
              />
            </div>
          )}

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <AnimatePresence>
            {weather && !error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-6 p-6 rounded-xl text-black bg-gray-100 backdrop-blur-xl shadow-md transition"
              >
                <h2 className="text-xl font-bold mb-2">
                  {weather.location.name}, {weather.location.country}
                </h2>

                <div className="flex justify-center items-center gap-4 mb-2">
                  {renderIcon(
                    getWeatherIconName(weather.current.condition.text)
                  )}
                  <span className="text-5xl font-bold">
                    {weather.current.temp_c}°C
                  </span>
                </div>

                <p className="capitalize mb-2">
                  {weather.current.condition.text}
                </p>

                <div className="flex justify-center gap-6 text-sm">
                  <p>💨 {weather.current.wind_kph} km/h</p>
                  <p>💧 {weather.current.humidity}%</p>
                  <p>🌡 Feels like {weather.current.feelslike_c}°C</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center gap-6 text-sm">
            <p className="mt-6 text-sm opacity-80">
              🚀 Created by <strong>Aman</strong>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
