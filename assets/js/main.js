// Page load displays time and date in header
    // Retrieves and renders searched cities from local storage in ul at side
        // Creates new li elements in ul when new cities are searched in input
        // li elements have delete button, removed when clicked
// When city is selected from list, fetch request is made to openweather API
    // Clicked city name gets the city ID from a JSON list
    // Current weather data is rendered to the main weather dashboard card
    // 5 day forecast is rendered to card

var apiKey = "9d4409d2aba8ab623ad65173ce78380e";
var cityListEl = document.querySelector(".city-list");
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
    }
   
};
init();

//Fetches weather data for input city name
//Saves input text to local storage and renders new city list item
function handleFormSubmit(event) {
    event.preventDefault();
    weatherCardEl.innerHTML = '';
    var inputName = document.querySelector('.city-input').value.trim();
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
                displayWeather(data, cityName);
                display5Day(data);
            })
    });
}

function displayWeather(data, cityName) {
    $(".weather-card").empty();
    $(".city-input").val('');
    var currentWeather = data.current;
    var currentTemp = currentWeather.temp;
    var currentTempEl = document.createElement("h5");
    currentTempEl.textContent= "Temp: " + currentTemp + "°C";

    var currentConditions = currentWeather.weather[0].description;
    var currentConditionsEl = document.createElement("h5");
    currentConditionsEl.textContent= currentConditions;

    var currentHumidity = currentWeather.humidity;
    var currentHumidityEl = document.createElement("h5");
    currentHumidityEl.textContent= "Humidity: " + currentHumidity + "%";

    var currentWind = currentWeather.wind_speed;
    var currentWindEl = document.createElement("h5");
    currentWindEl.textContent= "Wind Speed: " + currentWind + "m/s";

    var currentUV = currentWeather.uvi;
    var currentUVEl = document.createElement("h5");
    var UVindexEl = document.createElement("span");
    currentUVEl.textContent= "UV Index: ";
    UVindexEl.textContent = currentUV;
    console.log(currentUV)
    if (currentUV <= 2){
        UVindexEl.setAttribute("class", "favourable")
    }else if (currentUV > 2 && currentUV <= 8){
        UVindexEl.setAttribute("class", "moderate")
    } else if (currentUV >8){
        UVindexEl.setAttribute("class", "severe")
    };

    var currentIcon = currentWeather.weather[0].icon;
    var currentIconEl = document.createElement("img");
    currentIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
    currentIconEl.setAttribute("width", "100vw");
    var date = moment.unix(currentWeather.dt).format("ddd Do MMMM");
    console.log(date);

    $("<div>").addClass("card-header row").appendTo(weatherCardEl);
    $("<div>").addClass("name-date").appendTo($(".card-header"))
    $("<h2>").text(cityName).appendTo($(".name-date"));
    $("<h4>").text(date).appendTo($(".name-date"));

    var conditionsEl = document.createElement("div");
    conditionsEl.setAttribute("class", "conditions");
    document.querySelector(".card-header").appendChild(conditionsEl);
    conditionsEl.appendChild(currentIconEl);
    conditionsEl.appendChild(currentConditionsEl);
    
    weatherCardEl.appendChild(currentTempEl);
    weatherCardEl.appendChild(currentHumidityEl);
    weatherCardEl.appendChild(currentWindEl);
    currentUVEl.appendChild(UVindexEl);
    weatherCardEl.appendChild(currentUVEl);
}

function display5Day(weather) {
    $(".five-day").empty();
    var dailyWeatherArr = weather.daily;
    for (var i = 1; i < 6; i++) {
        var dailyWeather = dailyWeatherArr[i];

        //Create 5 day forecast cards
        var dailyCardEl = document.createElement("div");
        dailyCardEl.setAttribute('class', 'card col-2');
        
        //Display date
        var date = moment.unix(dailyWeather.dt).format("ddd Do");
        var dateEl = document.createElement("h5");
        dateEl.setAttribute("class", "card-title")
        dateEl.textContent = date;

        //Display icon
        var dailyIcon = dailyWeather.weather[0].icon;
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

function clearSearch() {
    window.localStorage.removeItem("savedCities");
    $(".city-list").empty();

}

//Click listeners to save run getWeather and handleFormSubmit functions
document.querySelector(".clear-search-btn").addEventListener('click', (clearSearch));
document.querySelector(".city-list").addEventListener('click', (pastCitySearch));
cityFormEl.addEventListener('submit', (handleFormSubmit));