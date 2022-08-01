const { reject } = require("lodash");

const API_KEY = process.env.API_KEY;

let inputText = document.querySelector('.search-part__input-text'),
    searchInputTextButton = document.querySelector('.search-part__input-button'),
    submitButton = document.querySelector('.search-part__submit'),
    requestedInformation = document.querySelector('.search-part__message'),
    headerIcon = document.querySelector('.header__icon'),
    searchPart = document.querySelector('.search-part'),
    weatherPart = document.querySelector('.weather-part'),
    weatherIcon = document.querySelector('.weather-part__icon');


console.debug('button:', searchInputTextButton)
console.debug('input text:', inputText)

inputText.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputText.value != '') {
        requestAPI(inputText.value, requestedInformation);
    }
})

searchInputTextButton.addEventListener("click", e => {
    console.debug('button is called')
    if (inputText.value != '') {
        requestAPI(inputText.value, requestedInformation);
    }
})

headerIcon.addEventListener("click", e => {
    if (headerIcon.classList.contains("header__icon--active")) {
        headerIcon.classList.toggle("header__icon--active");
        searchPart.classList.toggle('search-part--hidden');
        weatherPart.classList.toggle('weather-part--hidden');
        requestedInformation.classList.remove('search-part__message--error');
        requestedInformation.classList.remove('search-part__message--pending');
        inputText.value = "";
    }
})

submitButton.addEventListener("click", (e) => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            console.debug(position);
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const lang = 'pt_br';
            console.log(requestedInformation)
            showLoadingMessage(requestedInformation);
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=${lang}`
            fetchData(url);

        })
    } else {
        alert("O serviço de geolocalização não está disponível no seu dispositivo.");
    }
})

function showLoadingMessage(requestedInformation) {
    requestedInformation.innerText = "Buscando detalhes do clima...";
    requestedInformation.classList.remove('search-part__message--error');
    requestedInformation.classList.add('search-part__message--pending');
}

function requestAPI(cityName, requestedInformation) {
    showLoadingMessage(requestedInformation);
    cityName = cityName.trim();
    const lang = 'pt_br';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=${lang}`;
    fetchData(url);

}

function fetchData(url) {
    fetch(url)
        .then(response => response.json())
        .then(response => {
            seeWeatherDetails(response);

        })
        .catch(reject => {
            console.log(reject)
            requestedInformation.innerText = "Algo deu errado. Tente novamente.";
            requestedInformation.classList.replace('search-part__message--pending', 'search-part__message--error')

        })
}

function seeWeatherDetails(details) {
    if (details.cod == "404") {
        requestedInformation.classList.replace('search-part__message--pending', 'search-part__message--error')
        requestedInformation.innerText = `${inputText.value} não é um nome válido de cidade.`;
        return false;
    }
    searchPart.classList.toggle('search-part--hidden');
    weatherPart.classList.toggle('weather-part--hidden');
    headerIcon.classList.toggle('header__icon--active');
    const temperatureNumber = document.querySelector('.temperature__number');
    const weatherDescription = document.querySelector('.weather-part__weather');
    const locationAndCountry = document.querySelector('.location__name-and-country');
    const feelsLike = document.querySelector('#feels-like');
    const airHumidity = document.querySelector('#humidity');



    console.log('detalhes:', details)
    const { main: { feels_like, humidity, temp } } = details;
    const { name } = details;
    const { sys: { country } } = details;
    const { description, id, icon } = details.weather[0];
    // continues from here
    if (id >= 200 && id < 300) {
        weatherIcon.src = 'icons/thunder.svg'
    }
    else if (id >= 300 && id < 600) {
        weatherIcon.src = 'icons/rainy-5.svg'
    }
    else if (id >= 600 && id < 700) {
        weatherIcon.src = 'icons/snow-5.svg'
    }
    else if (id >= 701 && id <= 721) {
        weatherIcon.src = 'icons/haze.svg';
    }
    else if (id == 800) {
        weatherIcon.src = /d$/.test(icon) ? 'icons/day.svg' : 'icons/night.svg';
    }
    else if (id == 801) { //11-25%
        weatherIcon.src = /d$/.test(icon) ? 'icons/cloudy-day-1.svg' : 'icons/cloudy-night-1.svg';
    }
    else if (id == 802) { //25-50%
        weatherIcon.src = /d$/.test(icon) ? 'icons/cloudy-day-2.svg' : 'icons/cloudy-night-2.svg';
    }
    else if (id == 803) { //51-84%
        weatherIcon.src = /d$/.test(icon) ? 'icons/cloudy-day-3.svg' : 'icons/cloudy-night-3.svg';
    }
    else if (id == 804) { //85-100%
        weatherIcon.src = 'icons/cloudy.svg';
    }
    else {
        weatherIcon.src = 'icons/weather_sagittarius.svg';
    }


    temperatureNumber.innerText = Math.floor(temp);
    weatherDescription.innerText = description;
    locationAndCountry.innerText = `${name}, ${country}`;
    feelsLike.innerText = `${Math.floor(feels_like)}º`;
    airHumidity.innerText = `${humidity}%`
    console.debug('feels like:', feels_like, '- humidity: ', humidity, '- temp:', temp, '- description:', description)

}

// STARTS HERE
/*

#1 get componentes need from DOM
#2 get the key "enter press" and check whether the input is filled
#3 call the API
  #3.1 get route from API
  #3.2 get API key
  #3.3 call the API passing city name and API key
#4 check whether the call was sucessed or failed
  #4.1 get result
#5 show correct datas in the screen

*/