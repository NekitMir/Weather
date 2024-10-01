// Обработка отправки формы
const API_KEY = 'f31a5f2c2f5b8d514043c7c927a9ab04'

const form = document.querySelector('#form')
const input = document.querySelector('.form__input')

form.onsubmit = submitHandler

async function submitHandler(event) {
    event.preventDefault()

    if(!input.value.trim()) {
        alert('Введите название города')
        return
    }

    // const cityName = input.value.trim()
    // input.value = ''

    const cityInfo = await getGeo(input.value.trim())

    const weatherInfo = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon'])

    const weatherData = {
        name: weatherInfo.name,
        temp: weatherInfo.main.temp,
        humidity: weatherInfo.main.humidity,
        windSpeed: weatherInfo.wind.speed,
        main: weatherInfo.weather[0]['main']
    }

    renderWeatherData(weatherData)
}

async function getGeo(name) {
    const getUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`
    const response = await fetch(getUrl)
    const data = await response.json()

    return data
}

async function getWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`
    const response = await fetch(weatherUrl)
    const data = await response.json()

    return data
}

function renderWeatherData(data) {
    const weatherTemp = document.querySelector('.weather__temp')
    const nameCity = document.querySelector('.weather__city')
    const humidity = document.querySelector('#humidity')
    const wind = document.querySelector('#speed')
    const weatherImg = document.querySelector('.weather__img')

    weatherTemp.innerText = Math.round(data.temp) + '°С'
    nameCity.innerText = data.name
    humidity.innerText = data.humidity + '%'
    wind.innerText = data.windSpeed + 'km/h'

    const fileNames = {
        'Weather': 'weather',
        'Snow': 'snow',
        'Clouds': 'cloud',
        'Clear': 'sun',
        'Rain': 'rain'
    }

    if(fileNames[data.main]) {
        weatherImg.src = `/imgs/weather/${fileNames[data.main]}.svg`
    }
}