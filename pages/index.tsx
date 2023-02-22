import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";

export default function Home() {
  const [city, setCity] = useState("");
  const [info, setInfo] = useState<any>({});
  const [tUnit, setTUnit] = useState("c");

  const display = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/current.json",
      params: { q: city },
      headers: {
        "X-RapidAPI-Key": "9d858542d8msh47906ce0cf5beabp18a90fjsn7c4697be1939",
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setInfo(response.data.current);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <div className="container text-center">
      <h1 className="mb-5">Weather App</h1>
      <form onSubmit={display}>
        <input
          placeholder="Enter your City"
          onChange={(e) => {
            setCity(e.target.value);
          }}
        ></input>
        <input type={"submit"}></input>
      </form>
      {Object.keys(info).length === 0 ? null : (
        <div className="mt-5">
          <h1>Temp</h1>
          {tUnit === "c" ? <p>{info.temp_c}°C</p> : <p>{info.temp_f}°F</p>}

          <button
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
              ></Image>
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
