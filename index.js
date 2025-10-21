
 async function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`; //to get coordinates lat and long of the city searched
  const res = await fetch(geoUrl);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return {
      lat: data.results[0].latitude,
      lon: data.results[0].longitude
    };
  } else {
    alert("City Not found");
    throw new Error("City not found");
  }
}
//func to displays current weather
async function getWeather() {
  document.getElementById("forecast").style.display = "none";
  const city = document.getElementById("city").value;
  try {
    const { lat, lon } = await getCoordinates(city);
 
    const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m`;
 
    const [currentRes] = await Promise.all([
      fetch(currentUrl)
    ]);
 
    const currentData = await currentRes.json();
 
    // Display current weather immediately
    displayCurrent(currentData.current);
 
    // Show the forecast button now that current weather is displayed
    document.getElementById("show-forecast").style.display = "inline-block";
    document.getElementById("currentWeatherDiv").style.display = "inline-block";

 
  } catch (err) {
    alert(err.message);
  }
}
 // func to display current weather data
function displayCurrent(data) {
  document.getElementById("temperature").textContent = `${data.temperature_2m}°C`;
  document.getElementById("wind").textContent = `Wind: ${data.wind_speed_10m} km/h`;
  document.getElementById("humidity").textContent = `Humidity: ${data.relative_humidity_2m} %`;
  document.getElementById("city-name").textContent = document.getElementById("city").value;
 
  const icon = document.getElementById("weather-icon");
  if (data.weathercode === 0) {
    icon.src = "images/sun.png";
  } else {
    icon.src = "images/cloudy.png";
  }
}
 //fetch 7 days forecast
async function getForecast(){
  const city = document.getElementById("city").value;
  try {
    const { lat, lon } = await getCoordinates(city);
 
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
 
    const [forecastRes] = await Promise.all([
      fetch(forecastUrl)
    ]);
 
    const forecastData = await forecastRes.json();
 
    // Display forecast data
    displayForecast(forecastData.daily);
 
  }
  catch(err){
        alert(err.message);
  }
}
 //display forecast's data
function displayForecast(data) {
 
  const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const dayItems = document.querySelectorAll("#forecast .day-item");
 
  data.time.forEach((dateStr, i) => {
    if (dayItems[i]) {
      const dayName = weekdayFmt.format(new Date(dateStr));
      dayItems[i].querySelector(".day-label").textContent = dayName;
      dayItems[i].querySelector(".day-temps").textContent =
        `${data.temperature_2m_min[i]}°C / ${data.temperature_2m_max[i]}°C`;
    }
  });
 
  // Show the forecast section
  document.getElementById("forecast").style.display = "block";
}
 