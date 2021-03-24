// Page load displays time and date in header
    // Retrieves and renders searched cities from local storage in ul at side
        // Creates new li elements in ul when new cities are searched in input
        // li elements have delete button, removed when clicked
// When city is selected from list, fetch request is made to openweather API
    // Clicked city name gets the city ID from a JSON list
    // Current weather data is rendered to the main weather dashboard card
    // 5 day forecast is rendered to card

var apiKey = "9d4409d2aba8ab623ad65173ce78380e";
// var timeEl = document.getElementById("current-time");
// var dateEl = document.getElementById("current-date");
var cityNameEl = document.querySelector(".city-name-li");
var cityListEl = document.querySelector('.city-list');
var cityFormEl = document.querySelector('.city-input-form');

//Displays current time and date
// function displayTime() {
//     let time = moment().format('hh:mm');
//     let date = moment().format('MMM Do YYYY');
//     timeEl.textContent = time;
//     dateEl.textContent = date;
// }
// setInterval(displayTime, 1000);

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
    var cityName = event.target.getAttribute("data-cityName");
    getWeather(cityName);
}

//Executes fetch request from API for selected city data
function getWeather(cityName) {
fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });
}

//Click listeners to save run getWeather and handleFormSubmit functions
document.querySelector(".city-list").addEventListener('click', (pastCitySearch));
cityFormEl.addEventListener('submit', (handleFormSubmit));