import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search from "../assets/search.png";
import humidity from "../assets/humidity.png";
import sun from "../assets/sun.png";
import wind from "../assets/wind.png";
import clear from "../assets/clear.png";
import drizzle from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import cloud from "../assets/cloud.png";
import snow from "../assets/snow.png";
import { toastErrorNotify, toastWarnNotify } from "../helpers/ToastNotify";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef();

  const apiIconCodes = {
    "01d": clear,
    "01n": clear,
    "01d": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  useEffect(() => {
    searchFunc("London");
  }, []);

  const searchFunc = async (city) => {
    if (city.trim() === "") {
      toastWarnNotify("Please enter a city name");
      return;
    }
    try {
      const apıUrl = import.meta.env.VITE_API_URL
      const appId = import.meta.env.VITE_APP_ID
      const url = `${apıUrl}/data/2.5/weather?q=${city}&units=metric&appid=${appId}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      const icon = apiIconCodes[data.weather[0].icon] || clear;
      setWeatherData({
        city: data.name,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        icon: icon,
      });
      inputRef.current.value = ""
    } catch (error) {
      console.log(error);
      toastErrorNotify(error.message);
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input type="text" placeholder="Search" required ref={inputRef} />
        <img
          src={search}
          alt="search-icon"
          onClick={() => searchFunc(inputRef.current.value)}
        />
      </div>
      {weatherData ? (
        <>
          <img src={sun} alt="weather-icon" className="sun-icon" />
          <p className="temperature">{weatherData.temperature}°c</p>
          <p className="location">{weatherData.city}</p>
          <div className="weather-info">
            <div className="col">
              <img src={humidity} alt="humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind} alt="humidity" />
              <div>
                <p>{weatherData.wind} Km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
