// Page load displays time and date in header
    // Retrieves and renders searched cities from local storage in ul at side
        // Creates new li elements in ul when new cities are searched in input
        // li elements have delete button, removed when clicked
// When city is selected from list, fetch request is made to openweather API
    // Clicked city name gets the city ID from a JSON list
    // Current weather data is rendered to the main weather dashboard card
    // 5 day forecast is rendered to card

var apiKey = "9d4409d2aba8ab623ad65173ce78380e";
var cityNameEl = document.querySelector(".city-name-li");
var cityListEl = document.querySelector('.city-list');
var cityFormEl = document.querySelector('.city-input-form');
var weatherCardEl = document.querySelector('.weather-card');

//Renders list of cities from local storage
function init() {
    var cities = JSON.parse(window.localStorage.getItem("savedCities")) || [];
        for (var i = 0; i < cities.length; i++) {
            var city = cities[i];
            cityNameEl = document.createElement("li");
            cityNameEl.setAttribute("class", "city-name-li");
            cityNameEl.setAttribute("data-cityName", city);
            cityNameEl.textContent = city;
            cityListEl.appendChild(cityNameEl);
            };
}
init();

//Fetches weather data for input city name
//Saves input text to local storage and renders new city list item
function handleFormSubmit(event) {
    event.preventDefault();
    weatherCardEl.innerHTML = '';
    var inputName = document.querySelector('#city-input').value.trim();
    var cityList = JSON.parse(window.localStorage.getItem("savedCities")) || [];
    cityList.push(inputName);
    window.localStorage.setItem("savedCities", JSON.stringify(cityList));
    cityNameEl = document.createElement("li");
    cityNameEl.setAttribute("class", "city-name-li");
    cityNameEl.setAttribute("data-cityName", inputName);
    cityNameEl.textContent = inputName;
    cityListEl.appendChild(cityNameEl);
    cityName = inputName;
    getWeather(cityName);
}

//Runs getWeather function when city is clicked
function pastCitySearch(event) {
    weatherCardEl.innerHTML = '';
    var cityName = event.target.getAttribute("data-cityName");
    getWeather(cityName);
}

function getWeather(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + apiKey)
        .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var lat = data.city.coord.lat;
        var long = data.city.coord.lon;
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ long +'&units=metric&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                // console.log("complete", data);
                displayWeather(data);
                display5Day(data);
            })
    });
}

function displayWeather(data) {
    $(".weather-card").empty();
    var currentTemp = data.current.temp;
    var currentConditions = data.current.weather[0].description;
    var currentHumidity = data.current.humidity;
    var currentWind = data.current.wind_speed;
    var currentUV = data.current.uvi;
    var currentIcon = data.current.weather[0].icon;
    var currentIconEl = document.createElement("img");
    currentIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
    currentIconEl.setAttribute("width", "400px");
    document.querySelector(".weather-card").appendChild(currentIconEl);
}

function display5Day(data) {
    $(".five-day").empty();
    var dailyWeatherArr = data.daily;
    // console.log(dailyWeatherArr);
    for (var i = 1; i < 6; i++) {
        // console.log(dailyWeatherArr[i]);
        var dailyIcon = data.daily[i].weather[0].icon;
        var dailyTemp = data.daily[i].temp.day;
        var dailyCardEl = document.createElement("div");
        dailyCardEl.setAttribute('class', 'card col-2');
        var dailyIconEl = document.createElement("img");
        dailyIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
        var dailyTempEl = document.createElement("p");
        dailyTempEl.textContent = dailyTemp;

        dailyCardEl.appendChild(dailyTempEl);
        dailyCardEl.appendChild(dailyIconEl);
        document.querySelector(".five-day").appendChild(dailyCardEl);

    }
    // var timestamp = data.daily[1].dt;
    // var day = moment.unix(timestamp);
    // console.log(day);
         
}

//Click listeners to save run getWeather and handleFormSubmit functions
document.querySelector(".city-list").addEventListener('click', (pastCitySearch));
cityFormEl.addEventListener('submit', (handleFormSubmit));