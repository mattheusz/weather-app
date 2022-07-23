const { reject } = require("lodash");

const API_KEY = '6f20974040994af77981d119adb25248';

let inputText = document.querySelector('.search-part__input-text'),
    submitButton = document.querySelector('.search-part__submit'),
    requestedInformation = document.querySelector('.search-part__message');

inputText.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputText.value != '') {
        requestAPI(inputText.value, requestedInformation);
    }
})

function requestAPI(cityName, requestedInformation) {
    requestedInformation.innerText = "Buscando detalhes do clima...";
    requestedInformation.classList.add('search-part__message--pending');
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
        requestedInformation.classList.replace("pending", "error");
        requestedInformation.innerText = `${inputText.value} isn't a valid city name`;
    }

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