import { useEffect, useState } from "react"
import "./Home.css";
import { MdRoom, MdOutlineSearch } from "react-icons/md";
import axios from "axios";
import { WeatherCard } from "./WeatherCard";

export const Home = () => {
    const [city, setCity] = useState("hyderabad");
    const [dailyWeather, setDailyWeather] = useState([]);
    const [todayWeather, setTodayWeather] = useState({});
    useEffect(() => {
        const get_Livelocation = () => {
            axios.get("https://ipinfo.io/json?token=cf2f78e79716c1").then(({ data }) => { setCity(data.city); })
        }
        get_Livelocation();
    }, []);

    useEffect(() => {
        getData();
    }, [city])

    const getData = () => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&appid=91dd9acfc6da1b22dec07cea91f20cc0`)
            .then(({ data }) => {
                let lon = data.coord.lon;
                let lat = data.coord.lat;
                console.log(lon, lat);
                get7days_Weather_data(lat, lon)
            })
    }

    const get7days_Weather_data = (lat, lon) => {
        axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=d54127831363f5d205bdc32128b1210b`)
            .then(({ data }) => { setDailyWeather(data.daily); setTodayWeather(data.daily[0]) })

    }

    console.log(todayWeather);


    const debounce = (cb) => {
        let timer;
        return (...args) => {
            const context = this;
            clearTimeout(timer);
            timer = setTimeout(() => {
                cb.apply(context, ...args)
            }, 1000)
        }
    }

    const inputHandler = (e) => {
        setCity(e.target.value)
    }


    return (
        <>
            <div className="searchbar">
                <div> <MdRoom style={{ fontSize: "30px" }} /></div>
                <div><input type={"text"} onChange={(e) => { inputHandler(e) }} value={city}></input></div>
                <div><MdOutlineSearch style={{ fontSize: "30px" }} /></div>
            </div>
            <div className="slide-main">
                {dailyWeather && dailyWeather.map((e, i) => (
                    <div key={i} onClick={() => (setTodayWeather(e))}>
                        <div className="temp">
                            <p>{Math.floor(e.temp.min)}°C</p>
                            <p>{Math.floor(e.temp.max)}°C</p>
                        </div>
                        <img style={{ width: "80px" }}
                            src={`https://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png`}
                            alt="temprecutre logo" />
                        <p style={{ justifyItems: "center" }}>{e.weather[0].main}</p>
                    </div>))}
            </div>
            <div className="last">
                <div>
                    <h4>Pressure</h4>
                    <p>{todayWeather.pressure} hpa</p>
                </div>
                <div>
                    <h4>Humidity</h4>
                    <p>{todayWeather.humidity} %</p>
                </div>
            </div>
        </>
    )
}