// Page load displays time and date in header
    // Retrieves and renders searched cities from local storage in ul at side
        // Creates new li elements in ul when new cities are searched in input
        // li elements have delete button, removed when clicked
// When city is selected from list, fetch request is made to openweather API
    // Clicked city name gets the city ID from a JSON list
    // Current weather data is rendered to the main weather dashboard card
    // 5 day forecast is rendered to card

var timeEl = document.getElementById("current-time");
var dateEl = document.getElementById("current-date");

function displayTime() {
    let time = moment().format('hh:mm');
    let date = moment().format('MMM Do YYYY');
    timeEl.textContent = time;
    // console.log(time);
    dateEl.textContent = date;
    // console.log(date);
}
setInterval(displayTime, 1000);

function getWeather(cityName) {
    // var cityName = "Manchester";
    // var API_KEY = "9d4409d2aba8ab623ad65173ce78380e";
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Manchester&appid=9d4409d2aba8ab623ad65173ce78380e')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });
}
getWeather ();