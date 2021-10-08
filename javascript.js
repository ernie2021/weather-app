//moment js
var today = moment()
//initializing local storage
var listOfCities = {}
//cities list ul from dom
var citiesListEl = document.querySelector("#citiesList")
//variable for city selected
var citySelected = localStorage.getItem("citySelected");
//slecting the current weather article
var currentWeatherEl = document.querySelector("#currentWeather");
//selecting all the children of current weather
var currentWeatherChildren = currentWeatherEl.children;
//selecting all the articles for 5-day
var fiveDayForecastEl = document.querySelectorAll(".forecastEntry")
console.log(fiveDayForecastEl)
//Selecting the search area
var searchCityEl = document.querySelector("#searchCity");
//submit button
var submitBtnEl = document.querySelector("#submitButton")
//begining of google api
const beginAPI = "https://maps.googleapis.com/maps/api/geocode/json?address="
const apiKey = "&key=AIzaSyAuqgl7dsUP9zT8BE6N9SCMrfgDBNTqQ1U"
//initializing lat and lng object
var latLng = {
  lat: 0,
  lng: 0,
}
//initializing current weather object
var currentWeather = {
  locationName: "",
  emoji:"",
  date: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
}
//initializing 5-day forecast object
var fiveDayForecast = {
  0: {
  locationName: "",
  emoji:"",
  date: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
  },
  1: {
  locationName: "",
  emoji:"",
  date: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
  },
  2: {
  locationName: "",
  emoji:"",
  date: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
  },
  3: {
  locationName: "",
  emoji:"",
  date: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
  },
  4: {
  locationName: "",
  emoji:"",
  date: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
  },
  5: {
  locationName: "",
  emoji:"",
  date: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  uvIndex: 0,
  },
}

//begining of weather api
var beginWeatherAPI = "https://api.openweathermap.org/data/2.5/onecall?"
var weatherAPIKey = "&units=imperial&appid=2ab46f6f1c3f62d4b950521e55d40e00"

function callGeolocation() {
  //fetching the response
  fetch(beginAPI + searchCityEl.value.replace(/\s+/g, "") + apiKey)
  .then(function(response) {
    if (response.status === 200) {
      
      return response.json();
    }
  })
  //change selection and create a new list item
  .then(function(data) {
    //update latLng
    updateLatLng(data.results[0].geometry.location.lat, latLng.lng = data.results[0].geometry.location.lng);
    //update citySelected
    updateCitySelected(data.results[0].address_components[0].long_name);

    //for in for listOfCities listing the name of each city
    for (const property in listOfCities) {
      //initializing empty citiesArray
      var citiesArray = [];
      //pushing each city name into the array
      citiesArray.push(listOfCities[property].locationName);
    }
    //find the name of the value of the search in the array
    var locationAlreadySelected = citiesArray.find(isLocationSelected)
    
    //if the curl is successful and there is an entry already
    if (locationAlreadySelected) {
      return
    } else {
      //add new li
      var newLi = createNewListItem(citySelected, latLng.lat, latLng.lng)
  
      addCityToLocalStorage(newLi)

    }

    })
}
//function to find search value in listOfCities
function isLocationSelected(location) {
  return location == citySelected;
}
//function to update the city selected on both variable and localStorage levels
function updateCitySelected(newSelection) {
  citySelected = newSelection;
  localStorage.setItem("citySelected", newSelection);
}
//function to update lat and lng for latLng
function updateLatLng(lat, lng) {
  latLng.lat = lat;
  latLng.lng = lng;
}

//Weather Api call function
function callWeatherAPI() {
  fetch(beginWeatherAPI+"lat="+latLng.lat+"&lon="+latLng.lng+weatherAPIKey)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //update current weather
    updateCurrentWeather(data)
    //update 5-day forecast
    updateFiveDayData(data)
    //update dom 5-day dom
    updateFiveDayDom();
  })
}

function updateCurrentWeather(data) {
  const newCurrentWeather = data.current;
  //location name
  currentWeather.locationName = citySelected
  //date
  currentWeather.date = today.utcOffset(data.timezone_offset).format("M/D/YYYY")
  //temp
  currentWeather.temp = newCurrentWeather.temp
  //wind
  currentWeather.wind = newCurrentWeather.wind_speed
  //humidity
  currentWeather.humidity = newCurrentWeather.humidity
  //uvIndex
  currentWeather.uvIndex = newCurrentWeather.uvi
  //emoji
  currentWeather.emoji = newCurrentWeather.weather[0].icon
  
  //update #currentWeatherDate
  currentWeatherEl.querySelector("#currentWeatherDate").textContent = currentWeather.locationName + " " + currentWeather.date
  //update #currentWeatherTemp
  currentWeatherEl.querySelector("#currentWeatherTemp").innerHTML = "Temp: " + currentWeather.temp + "&deg; F"
  //update #currentWeatherWind
  currentWeatherEl.querySelector("#currentWeatherWind").textContent = "Wind: " + currentWeather.wind + " MPH"
  //update #currentWeatherHumidity
  currentWeatherEl.querySelector("#currentWeatherHumidity").innerHTML = "Humidity: " + currentWeather.humidity + "&percnt;"
  //update #currentWeatherUV
  var uvSpan = currentWeatherEl.querySelector("#uvSpan")
  uvSpan.textContent = currentWeather.uvIndex
  //update #currentWeatherIcon
  currentWeatherEl.querySelector("#currentWeatherIcon").src = "http://openweathermap.org/img/wn/" + currentWeather.emoji + "@2x.png"
  //If the uvIndex is 2 or below color the background green
  if (currentWeather.uvIndex <= 2) {
    uvSpan.style.backgroundColor = "#008000"
    uvSpan.style.color = "White"
  }
  //if the uvIndex is greater than 2 then color it yellow
  if (currentWeather.uvIndex > 2) {
    uvSpan.style.backgroundColor = "#FFFF00"
  }
  //if the uvIndex is greater than 6 then color it red
  if (currentWeather.uvIndex > 6) {
    uvSpan.style.backgroundColor = "#FF0000"
    uvSpan.style.color = "White"
  }
}

function updateFiveDayData(data) {
  //for in to update each entry in 5-day object
  for (const key in fiveDayForecast) {
    if (Object.hasOwnProperty.call(fiveDayForecast, key)) {
      const element = fiveDayForecast[key];
      const newFiveDay = data.daily[key]
      //setting the name
      element.locationName = citySelected
      console.log(newFiveDay)
      //date
      element.date = moment.utc(newFiveDay.dt * 1000).format("M/D/YYYY")
      //temp
      element.temp = newFiveDay.temp.day;
      //wind
      element.wind = newFiveDay.wind_speed
      //humidity
      element.humidity = newFiveDay.humidity
      //uvi
      element.uvIndex = newFiveDay.uvi
      //emoji
      element.emoji = newFiveDay.weather[0].icon
      
    }
  }
}

function updateFiveDayDom() {
  //for loop to select articles
  for (let i = 0; i < fiveDayForecastEl.length; i++) {
    const element = fiveDayForecastEl[i];
    const newI = i + 1
    //update forecastDate
    element.querySelector(".forecastDate").textContent = fiveDayForecast[newI].date;
    //update forecastEmoji
    element.querySelector(".forecastEmoji").src = "http://openweathermap.org/img/wn/" + fiveDayForecast[newI].emoji + "@2x.png"
    //update forecastTemp
    element.querySelector(".forecastTemp").innerHTML = "Temp: " + fiveDayForecast[newI].temp + "&deg; F";
    //update forecastWind
    element.querySelector(".forecastWind").textContent = "Wind: " + fiveDayForecast[newI].wind + " MPH"
    //update forecastHumidity
    element.querySelector(".forecastHumidity").innerHTML = "Humidity: " + fiveDayForecast[newI].humidity + "&percnt;"
    
    
  }

}

function createNewListItem(name, lat, lng) {
  var newLi = document.createElement("li")
  //set data-locationName
  newLi.setAttribute("data-locationName", name)
  //set data-Lat
  newLi.setAttribute("data-lat", lat)
  //set data-lng
  newLi.setAttribute("data-lng", lng)
  //text content
  newLi.textContent = name
  //adding class for event listener
  newLi.classList.add("cityListItem")
  newLi.classList.add("btn")
  newLi.classList.add("btn-primary")
  //append to ul
  citiesListEl.appendChild(newLi)
  return newLi
}

function addCityToLocalStorage(newLi) {
  //var for location name
  var newLocationName = newLi.dataset.locationname;
  //var for lat
  var newLat = newLi.dataset.lat;
  //var for lng
  var newLng = newLi.dataset.lng;
  //index for new object entry
  var newIndex = Object.keys(listOfCities).length

  var newObject = {locationName: newLocationName, lat: newLat, lng: newLng,}

  //update listOfCities
  listOfCities[newIndex] = newObject;
  //set it to local storage
  localStorage.setItem("listOfCities", JSON.stringify(listOfCities))

}

function updateCitiesList() {
  for (const key in listOfCities) {
    if (Object.hasOwnProperty.call(listOfCities, key)) {
      const element = listOfCities[key];
      createNewListItem(element.locationName, element.lat, element.lng)
    }
  }
}

//on load
//validating if there is an item in local storage with the key listOfCities
if (localStorage.getItem("listOfCities")) {
  //set the listOfCities variable to the value from local storage
  listOfCities = JSON.parse(localStorage.getItem("listOfCities"));
  //set the city selected item in local storage to the first city in listOfCities' locationName
  localStorage.setItem("citySelected", listOfCities[0].locationName)

  citySelected = localStorage.getItem("citySelected");
  //call weather api
  callWeatherAPI()
  //update cities list
  updateCitiesList()
} else {
  //set listOfCities to longbeach by default since there are no values already
  listOfCities = {
    0: {
      locationName: "LongBeach",
      lat: 33.8003309,
      lng: -118.2261493
    }
  }
  //writing listOfCities object to local storage
  localStorage.setItem("listOfCities", JSON.stringify(listOfCities));
  localStorage.setItem("citySelected", "LongBeach");
  //setting citySelected to the calue in local storage
  citySelected = "LongBeach";
  //call weather api
  callWeatherAPI()
  //update cities list
  updateCitiesList()
}
//setting latLng to first city
latLng.lat = listOfCities[0].lat;
latLng.lng = listOfCities[0].lng;

//when the search button is pressed
submitBtnEl.addEventListener("click", function(event) {
  //prevent default
  event.preventDefault();
  //search the value in geocode api
  callGeolocation();
  //search the value in the weather api
  callWeatherAPI();
  
  
})

//selecting all cityListItems
var cityListItems = document.querySelectorAll(".cityListItem")

for (let i = 0; i < cityListItems.length; i++) {
  const element = cityListItems[i];
  console.log(element)
  element.addEventListener("click", function(Event) {
    //prevent default
    Event.preventDefault();
    //Setting all data from data set to variables
    var itemLat = Event.target.dataset.lat;
    var itemLng = Event.target.dataset.lng;
    var itemLocationName = Event.target.dataset.locationname;
    //updating latLng
    updateLatLng(itemLat, itemLng);
    //updating citySelected
    updateCitySelected(itemLocationName)
    //call weather api
    callWeatherAPI()
  })
}


function populateCurrentDay() {
}


