export const WeatherCard = (todayWeather) => {
    console.log(todayWeather)
    return (<>
        <div>
            {todayWeather && (
                <div>
                    <h1>
                        {Math.floor(
                            todayWeather.temp.max
                        )}
                        °C
                    </h1>
                    {/* <img
                        src={`http://openweathermap.org/img/wn/${todayWeather.weather[0].icon
                            }@2x.png`}
                        alt="weather icon"
                    /> */}
                </div>
            )
            }
        </div>
    </>)
}