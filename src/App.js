import './App.css';
import { useEffect, useState } from 'react'

/*Images*/ 
import clearIcon from './assets/clear.png';
import cloudIcon from './assets/cloud.png';
import drizzleIcon from './assets/drizzle.png';
import rainIcon from './assets/rain.png';
import snowIcon from './assets/snow.png';
import searchIcon from './assets/search.png';
import humidityIcon from './assets/huminity.png';
import windIcon from './assets/wind.png'

const WeatherDetails = (props) => {
  return (
    <>
      <div className="image">
        <img src={props.icon} alt="image" />
      </div>
      <div className='temp'>
        {props.temp}°C
      </div>
      <div className='city'>
        {props.city}
      </div>
      <div className='country'>
        {props.country}
      </div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span>
          <span>{props.lat}</span>
        </div>
        <div>
          <span className='lon'>Longitude</span>
          <span>{props.lon}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt='humidity' className='icon' />
          <div className='data'>
            <div className='humidity-percent'>{props.humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt='wind' className='icon' />
          <div className='data'>
            <div className='wind-percent'>{props.wind} km/h</div>
            <div className='text'>Wind Speed</div>
          </div> 
        </div>   
      </div>
    </>
  )
}

function App() {
  const [text, setText] = useState("Colombo")

  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("Colombo")
  const [country, setCountry] = useState("Sri Lanka")
  const [lon, setLon] = useState(0)
  const [lat, setLat] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)

  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=d09f5ffb548e881ca236d853bb0f5af4&units=Metric`;

    try{
      let res = await fetch(url)
      let data = await res.json()

      // console.log(data)

      if(data.cod === '404'){
        console.error("City not found!!")
        setCityNotFound(true)
        setLoading(false)
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLon(data.coord.lon);
      setLat(data.coord.lat);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false)

    }catch(error){
      console.log(error)
      setError("An error occurred while fetching weather data.")
    }finally {
      setLoading(false)
    }
  }

  const handleCity = (e) => {
    setText(e.target.value);
  }

  const handleKey = (e) => {
    if(e.key === "Enter"){
      search()
    }
  }

  useEffect(() => {
    search();
  }, [])

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input 
          type="text" 
          className="cityInput" 
          placeholder="Search City" 
          onChange={handleCity}
          value={text}
          onKeyDown={handleKey} />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="" />
          </div>
        </div>

        {!loading && !error && <WeatherDetails 
        icon = {icon} 
        temp = {temp} 
        city = {city} 
        country = {country}
        lat = {lat} 
        lon = {lon}
        humidity = {humidity}
        wind = {wind} />}

        {loading && !cityNotFound && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-messsage'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found!!!</div>}

        <p className='copy-right'>
          Designed by <span>Dhinesh melroy</span>
        </p>
      </div>
    </>
  );
}

export default App;
 