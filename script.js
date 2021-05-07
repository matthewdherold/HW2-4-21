var searchEnter = $("#searchEnter");
var searchHistory = [];
var lat = "";
var lon = "";
if (JSON.parse(localStorage.getItem('history'))) {
    searchHistory = JSON.parse(localStorage.getItem('history'));
};

searchEnter.click(function() {
    var searchInput = $("#searchBar")[0].value;
    console.log(searchInput);
    searchSubmit(searchInput);
})

function init() {
    var history = $("#searchHistory");
    history.empty();
    var history1 = document.createElement('button');
    history1.setAttribute('id', `history1`);
    history1.append(searchHistory[0]);
    var history2 = document.createElement('button');
    history2.setAttribute('id', `history2`);
    history2.append(searchHistory[1]);
    var history3 = document.createElement('button');
    history3.setAttribute('id', `history3`);
    history3.append(searchHistory[2]);
    history.append(history1);
    history.append(history2);
    history.append(history3);
    history1 = $(`#history1`);
    history2 = $(`#history2`);
    history3 = $(`#history3`);
    history1.click(function(){
        searchSubmit(searchHistory[0]);
    });
    history2.click(function(){
        searchSubmit(searchHistory[1]);
    });
    history3.click(function(){
        searchSubmit(searchHistory[2]);
    });
};

searchSubmit = (searchInput) => {
    if (!searchInput) {
        alert(`please enter a valid location`);
    } else {
    searchHistory.push(searchInput);
    localStorage.setItem('history', JSON.stringify(searchHistory));
    var forecast = $(`#searchResults`);
    forecast.empty();
    console.log(searchInput);
    var URL = `http://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`;
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        var forecastTitle = document.createElement('h2');
        forecastTitle.append(`5-Day Forecast:`);
        forecast.append(forecastTitle);
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
                var currentDate = new Date(data.list[i].dt_txt).toLocaleDateString();
                var forecastDate = document.createElement('h4');
                var forecastEntry = document.createElement('div');
                var forecastIcon = document.createElement('img');
                forecastIcon.setAttribute('src',`http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
                forecastDate.append(currentDate);
                forecastEntry.append(
                                `High: ${data.list[i].main.temp_max} °F
                                Wind Speed: ${data.list[i].wind.speed} MPH
                                Humidity : ${data.list[i].main.humidity} %`
                                )
                forecast.append(forecastDate);
                forecast.append(forecastIcon);
                forecast.append(forecastEntry);
          };
        };
          fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=d91f911bcf2c0f925fb6535547a5ddc9&units=imperial`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                var currentResult = $(`#currentResult`);
                var currentReturn = document.createElement('h2');
                var currentIcon = document.createElement('img');
                lat = data.coord.lat;
                lon = data.coord.lon;
                currentIcon.setAttribute('src',`http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
                currentResult.empty();
                currentReturn.append(`Currently in ${searchInput}:`);
                currentResult.append(currentReturn);
                currentResult.append(`${data.weather[0].description}
                High: ${data.main.temp_max} °F
                Wind Speed: ${data.wind.speed} MPH
                Humidity : ${data.main.humidity} %`);
                currentResult.append(currentIcon);
            
            fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=d91f911bcf2c0f925fb6535547a5ddc9&lat=${lat}&lon=${lon}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    if (data.value < 3) {
                            uvresult = document.createElement('div');
                            uvresult.append(uvresult = `UV index: ${data.value} ; Good`);
                            currentResult.append(uvresult);
                            currentResult.addClass('good');
                    } else if (data.value < 7) {
                            uvresult = document.createElement('div');
                            uvresult.append(uvresult = `UV index: ${data.value} ; Moderate`);
                            currentResult.append(uvresult);
                            currentResult.addClass('moderate');
                    } else {
                            uvresult = document.createElement('div');
                            uvresult.append(uvresult = `UV index: ${data.value} ; Warning`);
                            currentResult.append(uvresult);
                            currentResult.addClass('warning');
                      }
                 })
                    
      });
    });   
    };
    init();
};
init();