
//func to get coordinates of a city
async function getCoordinates(city) {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    const res = await fetch(geoUrl);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude
      };
    } else {
      alert("City not found");
      throw new Error("City not found");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    alert("Failed to fetch coordinates. Please try again.");
    return null;
  }
}
//HTTP GET, func to displays current weather
async function getWeather() { 
  const weatherBtn = document.getElementById("weather-btn");
  const forecastBtn = document.getElementById("forecast-btn");
  
  //toggle button colors
  weatherBtn.classList.add("active");
  forecastBtn.classList.remove("active");

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
 
    // Show the button tabs
    document.getElementById("tab-button-section").style.display = "flex";

    //Show current weather section
    document.getElementById("current-weather").style.display = "block";
    
    //Hide forecast section
    document.getElementById("forecast-section").style.display = "none";

 
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
 //HTTP GET, fetch 7 days forecast
async function getForecast(){
  //change button bg color for 7 day forecast
  const weatherBtn = document.getElementById("weather-btn");
  const forecastBtn = document.getElementById("forecast-btn");

  //toggle button colors  
  forecastBtn.classList.add("active");
  weatherBtn.classList.remove("active");


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

    //Hide current section
    document.getElementById("current-weather").style.display = "none";

    //Show forecast section
    document.getElementById("forecast-section").style.display = "block";
 
  }
  catch(err){
        alert(err.message);
  }
}
 //display forecast's data
function displayForecast(data) {
 
  const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const dayItems = document.querySelectorAll("#forecast-section .day-item");
 
  data.time.forEach((dateStr, i) => {
    if (dayItems[i]) {
      const dayName = weekdayFmt.format(new Date(dateStr));
      dayItems[i].querySelector(".day-label").textContent = dayName;
      dayItems[i].querySelector(".day-temps").textContent =
        `${data.temperature_2m_min[i]}°C / ${data.temperature_2m_max[i]}°C`;
    }
  });
}
 
