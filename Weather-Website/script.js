document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    const apiKey = '994e7abf4041b1d894fd30b4c644eb98';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weather = populateData(data.list);
            display5DayForecast(weather);
        })
        .catch(error => console.error('Error fetching forecast', error));
});

//This is where the data for each date is populated
function populateData(weatherData) {
    const forecastPerDay = {};

    weatherData.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString();

        if (!forecastPerDay[date]) {
            forecastPerDay[date] = {
                temp: [],
                feelsLike: [],
                weather: entry.weather[0].description,
                humidity: [],
                wind_speed: []
            };
        }

        forecastPerDay[date].temp.push(entry.main.temp);
        forecastPerDay[date].feelsLike.push(entry.main.feels_like);
        forecastPerDay[date].humidity.push(entry.main.humidity);
        forecastPerDay[date].wind_speed.push(entry.wind.speed);
    });

    return Object.keys(forecastPerDay).map(date => {
        const dayData = forecastPerDay[date];
        return {
            date,
            temp: average(dayData.temp),
            feelsLike: average(dayData.feelsLike),
            weather: dayData.weather,
            humidity: average(dayData.humidity),
            wind_speed: average(dayData.wind_speed)
        };
    });
}

function average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

//This is the function used to display the data
function display5DayForecast(dailyForecast) {
    const weatherResult = document.getElementById('weather-result');
    weatherResult.innerHTML = ''; 

    dailyForecast.forEach((day, index) => {
        if (index < 5) { 
            const weatherClass = getWeather(day.weather);
            const weatherIcon = getIcon(day.weather);
            const weatherItem = `
                <div class="weather-day ${weatherClass}">
                    <h3>${day.date}</h3>
                    <i class="wi ${weatherIcon}"></i> <!-- Weather -->
                    <p>Temperature: ${day.temp.toFixed(1)}°C</p>
                    <p>Feels like: ${day.feelsLike.toFixed(1)}°C</p>
                    <p>Weather: ${day.weather}</p>
                    <p>Humidity: ${day.humidity.toFixed(1)}%</p>
                    <p>Wind Speed: ${day.wind_speed.toFixed(1)} m/s</p>
                </div>
            `;
            weatherResult.innerHTML += weatherItem;
        }
    });
}

//Assign for the colour of each weather type
function getWeather(type) {
    switch (type.toLowerCase()) {
        case 'clear sky':
            return 'sunny';
        case 'few clouds':
        case 'scattered clouds':
        case 'broken clouds':
        case 'overcast clouds':
            return 'cloudy';
        case 'rain':
        case 'light rain':    
        case 'shower rain':
            return 'rain';
        case 'warm':
            return 'warm';
        default:
            return 'cloudy';
    }
}

//Assign for icon of each type
function getIcon(type){
    switch (type.toLowerCase()) {
        case 'clear sky':
            return 'wi-day-sunny';
        case 'few clouds':
        case 'scattered clouds':
            return 'wi-cloud';
        case 'broken clouds':
        case 'overcast clouds':
            return 'wi-cloudy';
        case 'light rain':    
        case 'shower rain':
        case 'rain':
            return 'wi-rain';
        case 'thunderstorm':
            return 'wi-thunderstorm';
        case 'snow':
            return 'wi-snow';
        case 'mist':
            return 'wi-fog';
        default:
            return 'wi-cloud';
    }
}
