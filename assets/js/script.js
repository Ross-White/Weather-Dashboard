var timeEl = document.getElementById("current-time");
var dateEl = document.getElementById("current-date");

function displayTime() {
    let time = moment().format('hh:mm:ss');
    let date = moment().format('MMM Do YYYY');
    timeEl.textContent = time;
    // console.log(time);
    dateEl.textContent = date;
    // console.log(date);
}

setInterval(displayTime, 1000);