import { useState } from "react";
import axios from "axios";

const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;

export default function Home() {
  const [city, setCity] = useState("");
  const [info, setInfo] = useState<any>({});
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
    <div>
      <h1>Weather App</h1>
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
        <div>
          <h1>Temp</h1>
          <p>{info.temp_c}</p>
        </div>
      )}
    </div>
  );
}
