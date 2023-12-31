'use strict';

//  class Workout {
//   date = new Date();
//   id = (new Date() + '').slice(-10);
//   clicks = 0;

//   constructor(coords, distance, duration) {
//     this.coords = coords; // [LAT , LONG]
//     this.distance = distance; //in km
//     this.duration = duration; //in min
//   }
//   _setDescription() {
//     // prettier-ignore
//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//     this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
//       months[this.date.getMonth()]
//     } ${this.date.getDate()}`;
//   }

//   click() {
//     this.clicks++;
//   }
// }

// class Running extends Workout {
//   type = 'running';

//   constructor(coords, distance, duration, cadence) {
//     super(coords, distance, duration, cadence);
//     this.cadence = cadence;
//     this.calcPace();
//     this._setDescription();
//   }

//   calcPace() {
//     //min/km
//     this.pace = this.duration / this.distance;
//     return this.pace;
//   }
// }

// class Cycling extends Workout {
//   type = 'cycling';

//   constructor(coords, distance, duration, elevationGain) {
//     super(coords, distance, duration);
//     this.elevationGain = elevationGain;
//     this.calcSpeed();
//     this._setDescription();
//   }
//   calcSpeed() {
//     //km /hr
//     this.speed = this.distance / (this.duration / 60);
//     return this.speed;
//   }
// }

// /////////////////////////////////////////////////

// //APPLICATION ARCHITECTURE

// // DOM elements
// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');

// class App {
//   #map;
//   #mapEvent;
//   #mapZoomLevel = 13;
//   #workouts = [];

//   constructor() {
//     //get user position
//     this._getPosition();

//     //get  data from local storage
//     this._getLocalStorage();

//     //attach event handlers
//     form.addEventListener('submit', this._newWorkout.bind(this)); // we the form listener was added to the constructor because we want to activate immediately the scripts loads
//     inputType.addEventListener('change', this._toggleElevationField); // same reason as above , we want it to activate immediately the script load
//     containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
//   }

//   _getPosition() {
//     // Check if geolocation is available and get the current position
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         this._loadMap.bind(this),
//         function () {
//           // Error callback function if geolocation is not available or user denies permission
//           alert('Could not get your position');
//         }
//       );
//     }
//   }

//   _loadMap(position) {
//     // Get latitude and longitude from the position object
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     //console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

//     // Create an array of coordinates using latitude and longitude
//     const coords = [latitude, longitude];

//     // Create a Leaflet map and set the view to the coordinates
//     this.#map = L.map('map').setView(coords, 13); // L is the Leaflet namespace and it has different methods like map, titlelayer

//     // Add a tile layer with OpenStreetMap data to the map
//     L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(this.#map);

//     // Add a click event listener to the map to handle adding markers
//     this.#map.on('click', this._showForm.bind(this));

//     this.#workouts.forEach(work => {
//       this._renderWorkoutMarker(work);
//     });
//   }

//   _showForm(mapE) {
//     this.#mapEvent = mapE;
//     form.classList.remove('hidden');
//     inputDistance.focus();
//   }

//   _hideForm() {
//     //empty the inputs
//     inputDistance.value =
//       inputCadence.value =
//       inputDuration.value =
//       inputElevation.value =
//         '';
//     form.style.display = 'none';
//     form.classList.add('hidden');
//     setTimeout(() => (form.style.display = 'grid'), 1000);
//   }

//   _toggleElevationField() {
//     inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   }

//   _newWorkout(e) {
//     const validInputs = (...inputs) =>
//       inputs.every(inp => Number.isFinite(inp));

//     const allPositive = (...inputs) => inputs.every(inp => inp > 0);

//     e.preventDefault();

//     //get data from form
//     const type = inputType.value;
//     const distance = +inputDistance.value;
//     const duration = +inputDuration.value;
//     const { lat, lng } = this.#mapEvent.latlng;
//     let workout;

//     //if workout running , create running object
//     if (type === 'running') {
//       const cadence = +inputCadence.value;

//       //check if data is valid
//       if (
//         /* !Number.isFinite(distance) ||
//       !Number.isFinite(duration) ||
//       !Number.isFinite(cadence) */
//         !validInputs(distance, duration, cadence) ||
//         !allPositive(distance, duration, cadence)
//       )
//         return alert('Inputs have to be positive numbers');

//       workout = new Running([lat, lng], distance, duration, cadence);
//     }

//     //if workout cycling , create cycling object
//     if (type === 'cycling') {
//       const elevation = +inputElevation.value;
//       if (
//         /* !Number.isFinite(distance) ||
//       !Number.isFinite(duration) ||
//       !Number.isFinite(elevation) */
//         !validInputs(distance, duration, elevation) ||
//         !allPositive(distance, duration)
//       )
//         return alert('Inputs have to be positive numbers');

//       workout = new Cycling([lat, lng], distance, duration, elevation);
//     }

//     //add new object to workout array
//     this.#workouts.push(workout);

//     //Render workout on map as marker
//     this._renderWorkoutMarker(workout);

//     //render workout on list
//     this._renderWorkout(workout);

//     //hide form + clear input fields
//     this._hideForm();

//     // set local storage to all elements
//     this._setLocalStorage();
//   }

//   _renderWorkoutMarker(workout) {
//     L.marker(workout.coords)
//       .addTo(this.#map)
//       .bindPopup(
//         L.popup({
//           maxWidth: 250,
//           minWidth: 100,
//           autoClose: false,
//           closeOnClick: false,
//           className: `${workout.type}-popup`,
//         })
//       )
//       .setPopupContent(
//         `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
//       )
//       .openPopup();
//   }

//   _renderWorkout(workout) {
//     let html = `<li class="workout workout--${workout.type}" data-id= ${
//       workout.id
//     }">
//     <h2 class="workout__title">${workout.description}</h2>
//     <div class="workout__details">
//       <span class="workout__icon">${
//         workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
//       }</span>
//       <span class="workout__value">${workout.distance}</span>
//       <span class="workout__unit">km</span>
//     </div>
//     <div class="workout__details">
//       <span class="workout__icon">⏱</span>
//       <span class="workout__value">${workout.duration}</span>
//       <span class="workout__unit">min</span>
//     </div>`;

//     if (workout.type === 'running') {
//       html += ` <div class="workout__details">
//       <span class="workout__icon">⚡️</span>
//       <span class="workout__value">${workout.pace.tofixed(1)}</span>
//       <span class="workout__unit">min/km</span>
//     </div>
//     <div class="workout__details">
//       <span class="workout__icon">🦶🏼</span>
//       <span class="workout__value">${workout.cadence}</span>
//       <span class="workout__unit">spm</span>
//     </div>
//   </li>`;
//     }

//     if (workout.type === 'cycling') {
//       html += ` <div class="workout__details">
//       <span class="workout__icon">⚡️</span>
//       <span class="workout__value">${workout.speed.tofixed(1)}</span>
//       <span class="workout__unit">km/h</span>
//     </div>
//     <div class="workout__details">
//       <span class="workout__icon">⛰</span>
//       <span class="workout__value">${workout.elevationGain}</span>
//       <span class="workout__unit">m</span>
//     </div>
//   </li>`;

//       form.insertAdjacentHTML('beforebegin', html);
//     }
//   }

//   _moveToPopup() {
//     // BUGFIX: When we click on a workout before the map has loaded, we get an error. But there is an easy fix:
//     if (!this.#map) return;

//     const workoutEl = e.target.closest('.workout');

//     if (!workoutEl) return;

//     const workout = this.#workouts.find(
//       work => work.id === workoutEl.dataset.id
//     );

//     this.#map.setView(workout.coords, this.#mapZoomLevel, {
//       animate: true,
//       pan: { duration: 1 },
//     });
//   }
//   _setLocalStorage() {
//     localStorage.setItem('workouts', JSON.stringify(this.#workouts));
//   }

//   _getLocalStorage() {
//     const data = JSON.parse(localStorage.getItem('workouts'));

//     if (!data) return;

//     this.workouts = data;

//     this.#workouts.forEach(work => {
//       this._renderWorkout(work);
//     });
//   }

//   reset() {
//     localStorage.removeItem('workouts');
//     location.reload();
//   }
// }

// const app = new App();

// Define the Workout class
class Workout {
  // Properties for workout class
  date = new Date(); // Current date
  id = (new Date() + '').slice(-10); // Create a unique ID
  clicks = 0; // Number of clicks

  // Constructor for workout
  constructor(coords, distance, duration) {
    this.coords = coords; // [LAT , LONG]
    this.distance = distance; // Distance in km
    this.duration = duration; // Duration in min
  }

  // Create a description based on workout type and date
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Format the description
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  // Increase the click count
  click() {
    this.clicks++;
  }
}

// Create a Running class that inherits from Workout
class Running extends Workout {
  type = 'running'; // Set workout type

  // Constructor for running workout
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration); // Call parent constructor
    this.cadence = cadence; // Cadence
    this.calcPace(); // Calculate pace
    this._setDescription(); // Set description
  }

  // Calculate pace (min/km)
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

// Create a Cycling class that inherits from Workout
class Cycling extends Workout {
  type = 'cycling'; // Set workout type

  // Constructor for cycling workout
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration); // Call parent constructor
    this.elevationGain = elevationGain; // Elevation gain
    this.calcSpeed(); // Calculate speed
    this._setDescription(); // Set description
  }

  // Calculate speed (km/hr)
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////////////////////////////////////

//APPLICATION ARCHITECTURE

//DOM elements
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Define the App class
class App {
  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  #workouts = [];

  //Constructor for the app
  constructor() {
    //Get user position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  // Get user's position using geolocation
  _getPosition() {
    if (navigator.geolocation) {
      // If geolocation is available
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // Load the map with the current position
        function () {
          alert('Could not get your position'); // Error callback
        }
      );
    }
  }

  // Load the map with given position
  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude]; // Array of coordinates

    // Create a Leaflet map and set the view
    this.#map = L.map('map').setView(coords, 13);

    // Add a tile layer with OpenStreetMap data to the map
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Add a click event listener to the map to handle adding markers
    this.#map.on('click', this._showForm.bind(this));

    // Render existing workouts on the map
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  // Show the workout form on the map click
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  // Hide the workout form
  _hideForm() {
    // Clear input values
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';

    // Hide the form with animation
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  // Toggle the visibility of elevation and cadence fields
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // Handle creation of a new workout
  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // Create a new running workout
    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // Create a new cycling workout
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add the new workout to the array
    this.#workouts.push(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form and clear input fields
    this._hideForm();

    // Save to local storage
    this._setLocalStorage();
  }

  // Render a workout marker on the map
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  // Render a workout on the list
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id= ${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;

    if (workout.type === 'running') {
      html += ` <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`;
    }

    if (workout.type === 'cycling') {
      html += ` <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>`;

      form.insertAdjacentHTML('beforebegin', html);
    }
  }

  // Move to the workout's popup on the map
  _moveToPopup() {
    if (!this.#map) return; // Avoid error if map not loaded yet

    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  // Store workouts in local storage
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  // Get workouts from local storage
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  // Reset the app and local storage
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

// Create an instance
const app = new App();
