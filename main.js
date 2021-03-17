const temperatureFields = document.querySelectorAll(".temp");
const dateFields = document.querySelectorAll(".date");
const descriptionFields = document.querySelectorAll(".description");
const feelsLikeFields = document.querySelectorAll(".feels-like");
const pressureFields = document.querySelectorAll(".pressure");
const humidityFields = document.querySelectorAll(".humidity");
const forecastTitle = document.querySelector(".forecast-title");
const windSpeedFields = document.querySelectorAll(".wind-speed");
const weatherIcons = document.querySelectorAll(".weather-icon");
const searchBar = document.querySelector(".search-bar");
const searchButton = document.querySelector(".search-button");
const cardsWrapper = document.querySelector(".cards-wrapper");

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function checkSearchCriteria() {
  if (searchBar.value === "") {
    if (!cardsWrapper.classList.contains("hidden")) {
      cardsWrapper.classList.add("hidden");
    }
    forecastTitle.innerHTML = "Please type something";
  } else {
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchBar.value}&appid=296c38156a2fbd4b42f1e264cfff6ad5`;
    const promise = fetch(WEATHER_URL);

    promise
      .then(function (response) {
        const processingPromise = response.json();
        return processingPromise;
      })
      .then(function (processedResponse) {
        if (processedResponse.message === "city not found") {
          if (!cardsWrapper.classList.contains("hidden")) {
            cardsWrapper.classList.add("hidden");
          }
          forecastTitle.innerHTML = "City not found, check spelling";
        } else {
          showWeather(processedResponse);
        }
      });
  }
}

function showWeather(obj) {
  let count = 0;

  forecastTitle.innerHTML = `${obj.city.name}, ${obj.city.country}`;

  obj.list.forEach((timestamp) => {
    let timestampDate = timestamp.dt_txt;   
    let timestampDayMonth = timestampDate.substring(5, 10);
    let timestampHour = timestampDate.substring(11, 13);

    if (count === 0) {
      updateWeather(timestamp, count, 'Tomorrow');
      count++;
    } else if (timestampDayMonth === dates[count] && timestampHour === "12") {
      updateWeather(timestamp, count, timestampDayMonth);
      count++;
    } else if (timestampDayMonth === dates[count] && timestampHour === "15") {
      updateWeather(timestamp, count, timestampDayMonth);
      count++;
    } else if (timestampDayMonth === dates[count] && timestampHour === "18") {
      updateWeather(timestamp, count, timestampDayMonth);
      count++;
    } else if (timestampDayMonth === dates[count] && timestampHour === "21") {
      updateWeather(timestamp, count, timestampDayMonth);
      count++;
    }
  });
  cardsWrapper.classList.remove("hidden");
}

function updateWeather(forecast, count, timestampDayMonth) {
  const temp = Math.round(forecast.main.temp - 273.15);
  UpdateTemperatures(temp, count);

  UpdateDates(timestampDayMonth, count);

  const detailedDescription = forecast.weather[0].description;
  UpdateDescriptions(titleCase(detailedDescription), count);

  const feelsLike = Math.round(forecast.main.feels_like - 273.15);
  UpdateFeelsLikes(feelsLike, count);

  const pressure = forecast.main.pressure;
  UpdatePressures(pressure, count);

  const humidity = forecast.main.humidity;
  UpdateHumidity(humidity, count);

  const windSpeed = forecast.wind.speed;
  UpdateWindSpeed(windSpeed, count);

  const mainDescription = forecast.weather[0].main;
  UpdateIcons(mainDescription, count);
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

function UpdateTemperatures(temp, count) {
  temperatureFields.forEach((field) => {
    if (field.dataset.key === String(count)) {
      field.innerHTML = `${temp}°`;
    }
  });
}

function UpdateDates(timestampDate, count) {
  dateFields.forEach((field) => {
    if (field.dataset.key === '0'){
      field.innerHTML = 'Now';
    } else if (field.dataset.key === '1') {
      field.innerHTML = 'Tomorrow';
    } else if (field.dataset.key === String(count)) {
      timestampDate.substring(0,2)
      field.innerHTML = `${timestampDate.substring(3,5)}/${timestampDate.substring(0,2)}`;
    }
  });
}

function UpdateDescriptions(description, count) {
  descriptionFields.forEach((field) => {
    if (field.dataset.key === String(count)) {
      field.innerHTML = description;
    }
  });
}

function UpdateFeelsLikes(feelsLike, count) {
  feelsLikeFields.forEach((field) => {
    if (field.dataset.key === String(count)) {
      field.innerHTML = `${feelsLike}°`;
    }
  });
}

function UpdatePressures(pressure, count) {
  pressureFields.forEach((field) => {
    if (field.dataset.key === String(count)) {
      field.innerHTML = `${pressure}hPa`;
    }
  });
}

function UpdateHumidity(humidity, count) {
  humidityFields.forEach((field) => {
    if (field.dataset.key === String(count)) {
      field.innerHTML = `${humidity}%`;
    }
  });
}

function UpdateWindSpeed(windSpeed, count) {
  windSpeedFields.forEach((field) => {
    if (field.dataset.key === String(count)) {
      field.innerHTML = `${windSpeed}mps`;
    }
  });
}

function UpdateIcons(main, count) {
  weatherIcons.forEach((icon) => {
    if (icon.dataset.key === String(count)) {
      switch (main) {
        case "Clouds":
          icon.src = "img/cloudy.svg";
          break;
        case "Clear":
          icon.src = "img/clearsky.svg";
          break;
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Fog":
        case "Sand":
        case "Dust":
        case "Ash":
        case "Squall":
        case "Tornado":
          icon.src = "img/mist.svg";
          break;
        case "Snow":
          icon.src = "img/snow.svg";
          break;
        case "Rain":
          icon.src = "img/rain.svg";
          break;
        case "Drizzle":
          icon.src = "img/drizzley.svg";
          break;
        case "Thunderstorm":
          icon.src = "img/Thunderstorm.svg";
          break;
      }
    }
  });
}

function convertToDate(timestamp) {
  const dateObject = new Date(timestamp * 1000);
  return dateObject.toLocaleString();
}

let dates = [];

generateDates();

function generateDates() {
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    dates.push(createStringDate(date.setDate(date.getDate() + i)));
  }
}

function createStringDate(date) {
  date = new Date(date);
  let dateDay = date.getDate();
  let dateMonth = date.getMonth() + 1;
  if (dateMonth < 10) {
    dateMonth = `0${dateMonth}`;
  }
  if (dateDay < 10) {
    dateDay = `0${dateDay}`;
  }
  return `${dateMonth}-${dateDay}`;
}

function onekeypress(e) {
  if (e.key === "Enter") {
    checkSearchCriteria();
  }
}

searchButton.addEventListener("click", checkSearchCriteria);
searchBar.addEventListener("keypress", onekeypress);
