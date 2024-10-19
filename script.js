const api = {
    key: "fcc8de7015bbb202209bbf0261babf4c", // Replace with your actual API key
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(searchbox.value);
    }
}

function getResults(query) {
    // Show loading indicator
    document.querySelector('.current .loading').style.display = 'block';
    document.querySelector('.current .error').style.display = 'none';
    document.querySelector('.current').innerHTML = '';

    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(displayResults)
        .catch(error => {
            const errorMessage = document.querySelector('.current .error');
            errorMessage.innerText = error.message;
            errorMessage.style.display = 'block';
        })
        .finally(() => {
            document.querySelector('.current .loading').style.display = 'none';
        });
}

function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.createElement('div');
    temp.classList.add('temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.createElement('div');
    weather_el.classList.add('weather');
    weather_el.innerText = weather.weather[0].description;

    let hilow = document.createElement('div');
    hilow.classList.add('hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

    let humidity = document.createElement('div');
    humidity.classList.add('humidity');
    humidity.innerText = `Humidity: ${weather.main.humidity}%`;

    let windSpeed = document.createElement('div');
    windSpeed.classList.add('wind-speed');
    windSpeed.innerText = `Wind Speed: ${Math.round(weather.wind.speed)} m/s`;

    document.querySelector('.current').append(temp, weather_el, hilow, humidity, windSpeed);
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click', () => {
    searchbox.value =
