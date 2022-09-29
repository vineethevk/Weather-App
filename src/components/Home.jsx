import { useEffect, useState } from "react"
import "./Home.css";
import { MdRoom, MdOutlineSearch } from "react-icons/md";
import axios from "axios";
import { WeatherCard } from "./WeatherCard";
import Chart from "react-apexcharts";


export const Home = () => {
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const Weather_icons = ["https://cdn-icons-png.flaticon.com/512/4814/4814268.png", "https://cdn-icons-png.flaticon.com/512/1163/1163661.png", "https://cdn-icons-png.flaticon.com/512/4246/4246656.png"]
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
                // console.log(lon, lat);
                get7days_Weather_data(lat, lon)
            })
    }

    const get7days_Weather_data = (lat, lon) => {
        axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=d54127831363f5d205bdc32128b1210b`)
            .then(({ data }) => { setDailyWeather(data.daily); setTodayWeather(data.daily[0]) })

    }



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
    console.log(todayWeather)
    const inputHandler = (e) => {
        setCity(e.target.value)
    }

    const getDate = (unix_time) => {
        let date = new Date(unix_time * 1000);
        return (weekday[date.getDay()]);
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
                        <div style={{ textAlign: "center" }}>
                            <p className="Bold" >{getDate(e.dt)}</p>
                        </div>
                        <div className="temp">
                            <p className="Bold">{Math.floor(e.temp.max)}°</p>
                            <p>{Math.floor(e.temp.min)}°</p>
                        </div>
                        <img style={{ width: "40px", margin: "20px" }}
                            // src={`https://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png`}
                            src={e.weather[0].main === "Rain" ? Weather_icons[2] : e.weather[0].main === "Clouds" ? Weather_icons[1] : Weather_icons[0]}
                            alt="temprecutre logo" />
                        <p style={{ textAlign: "center" }} className="Bold">{e.weather[0].main}</p>
                    </div>))}
            </div>
            <div></div>
            <div className="graph">
                {todayWeather.temp ? (<div className="Graph">
                    <Chart
                        type="area"
                        series={[
                            {
                                name: "Temperature",
                                data: [
                                    todayWeather.temp.morn,
                                    todayWeather.temp.day,
                                    todayWeather.temp.eve,
                                    todayWeather.temp.night,
                                ],
                            },
                        ]}
                        options={{
                            dataLabels: {
                                formatter: (val) => { },
                            },
                            yaxis: {
                                labels: {
                                    formatter: (val) => {
                                        return `${Math.floor(val)}℃`;
                                    },
                                },
                            },
                            xaxis: {
                                categories: ["6:00am", "12:00pm", "6:00pm", "12:00am"],
                            },
                        }}
                    />
                </div>) : <h4>...Loading</h4>}

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