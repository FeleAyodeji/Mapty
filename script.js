'use strict';

// prettier-ignore
// An array of months
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// DOM elements
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Check if geolocation is available and get the current position
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Get latitude and longitude from the position object
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      // Create an array of coordinates using latitude and longitude
      const coords = [latitude, longitude];

      // Create a Leaflet map and set the view to the coordinates
      const map = L.map('map').setView(coords, 13); // L is the Leaflet namespace and it has different methods like map, titlelayer

      // Add a tile layer with OpenStreetMap data to the map
      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add a click event listener to the map to handle adding markers
      map.on('click', function (mapEvent) {
        console.log(mapEvent);
        const { lat, lng } = mapEvent.latlng;

        // Add a marker to the clicked location and create a popup
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: 'running-popup',
            })
          )
          .setPopupContent('Workout')
          .openPopup();
      });
    },

    function () {
      // Error callback function if geolocation is not available or user denies permission
      alert('Could not get your position');
    }
  );
}
