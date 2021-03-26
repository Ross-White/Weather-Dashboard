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
    var currentWeather = data.current;
    // console.log(currentWeather);
    var currentTemp = currentWeather.temp;
    var currentTempEl = document.createElement("p");
    currentTempEl.textContent= currentTemp;

    var currentConditions = currentWeather.weather[0].description;
    var currentConditionsEl = document.createElement("p");
    currentConditionsEl.textContent= currentConditions;

    var currentHumidity = currentWeather.humidity;
    var currentHumidityEl = document.createElement("p");
    currentHumidityEl.textContent= currentHumidity;

    var currentWind = currentWeather.wind_speed;
    var currentWindEl = document.createElement("p");
    currentWindEl.textContent= currentWind;

    var currentUV = currentWeather.uvi;
    var currentUVEl = document.createElement("p");
    currentUVEl.textContent= currentUV;

    var currentIcon = currentWeather.weather[0].icon;
    var currentIconEl = document.createElement("img");
    currentIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
    currentIconEl.setAttribute("width", "400px");

    document.querySelector(".weather-card").appendChild(currentTempEl);
    document.querySelector(".weather-card").appendChild(currentConditionsEl);
    document.querySelector(".weather-card").appendChild(currentHumidityEl);
    document.querySelector(".weather-card").appendChild(currentWindEl);
    document.querySelector(".weather-card").appendChild(currentUVEl);
    document.querySelector(".weather-card").appendChild(currentIconEl);
}

function display5Day(weather) {
    $(".five-day").empty();
    var dailyWeatherArr = weather.daily;
    for (var i = 1; i < 6; i++) {
        var dailyWeather = dailyWeatherArr[i];

        //Create 5 day forecast cards
        var dailyIcon = dailyWeather.weather[0].icon;
        var dailyCardEl = document.createElement("div");
        dailyCardEl.setAttribute('class', 'card col-2');
        
        //Display date
        var date = moment.unix(dailyWeather.dt).format("ddd Do");
        var dateEl = document.createElement("p");
        dateEl.textContent = date;

        //Display icon
        var dailyIconEl = document.createElement("img");
        dailyIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
        
        //Display temperature and humidity
        var dailyTemp = dailyWeather.temp.day;
        var dailyTempEl = document.createElement("p");
        dailyTempEl.textContent = "Temp: " + dailyTemp + "°C";
        var dailyHumidity = dailyWeather.humidity;
        var dailyHumidityEl = document.createElement("p");
        dailyHumidityEl.textContent = "Humidity: " + dailyHumidity + "%";

        //Append all elements to page
        dailyCardEl.appendChild(dateEl);
        dailyCardEl.appendChild(dailyIconEl);
        dailyCardEl.appendChild(dailyTempEl);
        dailyCardEl.appendChild(dailyTempEl);
        dailyCardEl.appendChild(dailyHumidityEl);

        document.querySelector(".five-day").appendChild(dailyCardEl);

    }
    
         
}

//Click listeners to save run getWeather and handleFormSubmit functions
document.querySelector(".city-list").addEventListener('click', (pastCitySearch));
cityFormEl.addEventListener('submit', (handleFormSubmit));