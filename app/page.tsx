"use client";

import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import "./globals.css";

export default function Home() {
  const [city, setCity] = useState(""); // State for storing the input city
  const [info, setInfo] = useState<any>({}); // State for storing the weather information
  const [tUnit, setTUnit] = useState("c"); // State for temperature unit (celsius or fahrenheit)
  const [lat, setLat] = useState(0); // State for latitude
  const [lon, setLon] = useState(0); // State for longitude
  const [error, setError] = useState(""); // State for error message
  const [loading, setLoading] = useState(false); // State for loading state

  function successCallback(position: {
    coords: {
      latitude: SetStateAction<number>;
      longitude: SetStateAction<number>;
    };
  }) {
    setLat(position.coords.latitude); // Set latitude based on geolocation
    setLon(position.coords.longitude); // Set longitude based on geolocation
  }

  const errorCallback = () => {
    setError("Failed to retrieve geolocation."); // Handle error when geolocation retrieval fails
  };

  useEffect(() => {
    globalThis.navigator?.geolocation.getCurrentPosition(
      successCallback,
      errorCallback
    ); // Get geolocation when the component mounts
  }, []);

  const auto = () => {
    setCity(lat + "," + lon); // Set city based on geolocation coordinates
  };

  const display = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    const options = {
      method: "GET",
      url: process.env.NEXT_PUBLIC_URL,
      params: { q: city },
      headers: {
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_KEY,
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setInfo(response.data.current); // Set weather information
        setLoading(false); // Set loading state to false
        setError(""); // Clear any previous error
      })
      .catch(function (error) {
        if (error.response) {
          setError("Error: " + error.response.data.message); // Set error message from API response
        } else if (error.request) {
          setError("Error: No response from the server."); // Set error message for no response from server
        } else {
          setError("Error: " + error.message); // Set error message from other errors
        }
        setLoading(false); // Set loading state to false
      });
  };

  return (
    <div className="container text-center">
      <h1 className="mb-5">WEATHER APP</h1>
      <h1>Your location is at {city}</h1>
      <form className="input-group" onSubmit={display}>
        <input
          placeholder="Enter your City"
          className="text-center form-control"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
        <input type="submit" className="btn btn-primary ms-3" />
      </form>
      <button className="mt-3 btn btn-warning" onClick={auto}>
        Get your geolocation
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : Object.keys(info).length === 0 ? null : (
        <div className="mt-5">
          <h1>Temp</h1>
          {tUnit === "c" ? <p>{info.temp_c}°C</p> : <p>{info.temp_f}°F</p>}

          <button
            className="btn btn-secondary"
            onClick={() => {
              if (tUnit === "c") {
                setTUnit("f");
              } else {
                setTUnit("c");
              }
            }}
          >
            C/F
          </button>
          <div className="row">
            <div className="col">
              <h1 className="mt-5">Condition</h1>
              <p>{info.condition.text}</p>
            </div>
            <div className="col mt-4">
              <Image
                src={"https:" + info.condition.icon}
                width={80}
                height={80}
                alt=""
              />
            </div>
            <div className="col">
              <h1 className="mt-5">Windspeed</h1>
              <p>{info.wind_mph} m/s</p>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h1 className="mt-5">Pressure</h1>
              <p>{info.pressure_mb}</p>
            </div>
            <div className="col">
              <h1 className="mt-5">Humidity</h1>
              <p>{info.humidity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
