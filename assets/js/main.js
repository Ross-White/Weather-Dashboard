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
    // getCurrentWeather(cityName);
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
                console.log("complete", data);
                displayWeather(data);
            })
    });
}


function displayWeather(data) {
    var dailyDescription = data.daily[0].weather[0].description;
    var dailyIcon = data.daily[0].weather[0].icon;
    var dailyTemp = data.daily[0].temp.day;
    var dailyCardEl = document.createElement("div");
    dailyCardEl.setAttribute('class', 'card col-2');
    var dailyDateEl = document.createElement("h4");
    dailyDateEl.setAttribute('class', 'card-header');
    dailyDateEl.textContent = dailyDescription;
    var dailyIconEl = document.createElement("img");
    dailyIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
    var dailyTempEl = document.createElement("p");
    dailyTempEl.textContent = dailyTemp;
    
    dailyCardEl.appendChild(dailyTempEl);
    dailyCardEl.appendChild(dailyIconEl);
    dailyCardEl.appendChild(dailyDateEl);

    document.querySelector(".five-day").appendChild(dailyCardEl);
     
}

{/* <div class="card col-2">
    <h4 class="card-header">Date</h4>
    <img src="http://openweathermap.org/img/wn/10d@2x.png" width="50px"/>
    <p class="row">Temp, Humidity</p>
</div> */}

//Click listeners to save run getWeather and handleFormSubmit functions
document.querySelector(".city-list").addEventListener('click', (pastCitySearch));
cityFormEl.addEventListener('submit', (handleFormSubmit));