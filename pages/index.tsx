import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";

export default function Home() {
  const [city, setCity] = useState("");
  const [info, setInfo] = useState<any>({});
  const [tUnit, setTUnit] = useState("c");

  const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;

  const display = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const options = {
      method: "GET",
      url: "https://weatherapi-com.p.rapidapi.com/current.json",
      params: { q: city },
      headers: {
        "X-RapidAPI-Key": REACT_APP_API_KEY,
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
          <h1 className="mt-5">Condition</h1>
          <p>{info.condition.text}</p>
          <Image
            src={"https:" + info.condition.icon}
            width={80}
            height={80}
            alt=""
          ></Image>
        </div>
      )}
    </div>
  );
}
