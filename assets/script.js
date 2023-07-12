$(document).ready(function() {
    // API key for OpenWeatherMap
    const apiKey = "f2e56a945f06444047f57848e6e27620";
    const apiEndpoint = "https://api.openweathermap.org/data/2.5";
  
    // Retrieve the search history from local storage
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  
    // Display the search history
    displaySearchHistory();
  
    // Event listener for the search button
    $("#search-btn").on("click", function() {
      // Get the zip code input value
      const zipCode = $("#zip-code-input").val().trim();
  
      // Clear the input field
      $("#zip-code-input").val("");
  
      // Make the API call to get the weather data
      getWeatherData(zipCode);
    });
  
    // Function to get the weather data from the API
    function getWeatherData(zipCode) {
      // Set the API endpoint for current weather
      const currentWeatherEndpoint = `${apiEndpoint}/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`;
  
      // Make the API call
      $.ajax({
        url: currentWeatherEndpoint,
        method: "GET",
        success: function(response) {
          // Process the current weather data
          displayCurrentWeather(response);
  
          // Add the zip code to the search history if it doesn't exist
          if (!searchHistory.includes(zipCode)) {
            addZipCodeToSearchHistory(zipCode);
          }
  
          // Get the coordinates for the forecast
          const { lat, lon } = response.coord;
  
          // Set the API endpoint for the forecast
          const forecastEndpoint = `${apiEndpoint}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
          // Make the API call to get the forecast data
          $.ajax({
            url: forecastEndpoint,
            method: "GET",
            success: function(response) {
              // Process the forecast data
              displayForecast(response);
            },
            error: function() {
              console.log("Error occurred while fetching forecast data.");
            }
          });
        },
        error: function(xhr, status, error) {
          console.log("Error occurred while fetching current weather data.");
          console.log("Status:", status);
          console.log("Error:", error);
        }
      }).catch(function(error) {
        console.log("Error occurred:", error);
      });
    }
  
    // Function to display the current weather data
    function displayCurrentWeather(data) {
      // Clear the current weather container
      $("#current-weather").empty();
  
      // Extract the required data from the response
      const { name, dt, weather, main, wind } = data;
  
      // Format the date and time
      const dateTime = new Date(dt * 1000).toLocaleString();
  
      // Create the HTML structure for current weather
      const currentWeatherHTML = `
        <div class="card">
          <div class="card-front">
            <h2>${name}</h2>
            <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
          </div>
          <div class="card-back">
            <h2>${name} - ${dateTime}</h2>
            <p>Temperature: ${main.temp} °F</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} mph</p>
          </div>
        </div>
      `;
  
      // Append the current weather HTML to the container
      $("#current-weather").append(currentWeatherHTML);
    }
  
    // Function to display the forecast data
    function displayForecast(data) {
      // Clear the forecast container
      $("#forecast").empty();
  
      // Extract the data from the response
      const { list } = data;
  
      // Loop through the forecast data
      for (let i = 0; i < list.length; i += 8) {
        const { dt, weather, main, wind } = list[i];
  
        // Format the date
        const date = new Date(dt * 1000).toLocaleDateString();
  
        // Create the HTML structure for each forecast card
        const forecastHTML = `
          <div class="card">
            <div class="card-front">
              <h3>${date}</h3>
              <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
            </div>
            <div class="card-back">
              <h3>${date}</h3>
              <p>Temperature: ${main.temp} °F</p>
              <p>Humidity: ${main.humidity}%</p>
              <p>Wind Speed: ${wind.speed} mph</p>
            </div>
          </div>
        `;
  
        // Append the forecast HTML to the container
        $("#forecast").append(forecastHTML);
      }
    }
  
    // Function to add the zip code to the search history
    function addZipCodeToSearchHistory(zipCode) {
      searchHistory.push(zipCode);
  
      // Save the updated search history to local storage
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  
      // Display the updated search history
      displaySearchHistory();
    }
  
    // Function to display the search history
    function displaySearchHistory() {
      // Clear the search history container
      $("#search-history").empty();
  
      // Loop through the search history
      for (let i = 0; i < searchHistory.length; i++) {
        const zipCode = searchHistory[i];
  
        // Create a button element for the zip code
        const zipCodeButton = `<button class="zip-code-button">${zipCode}</button>`;
  
        // Append the button to the search history container
        $("#search-history").append(zipCodeButton);
      }
    }
  
    // Event listener for the zip code buttons in search history
    $(document).on("click", ".zip-code-button", function() {
      const zipCode = $(this).text();
  
      // Make the API call to get the weather data
      getWeatherData(zipCode);
    });
  });
  