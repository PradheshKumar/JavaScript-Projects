'use strict';

// prettier-ignore

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
class WorkOut {
  id = (Date.now() + '').slice(-10);
  click = 0;
  Date = new Date();
  desc = '';
  constructor(coords, distance, duration) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
  _SetDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.desc = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.Date.getMonth()]
    } ${this.Date.getDate()}`;
  }
  _click() {
    this.click++;
  }
}
class Running extends WorkOut {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadance = cadence;
    this.CalPace();
    this._SetDescription();
  }
  CalPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends WorkOut {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.CalElevation();
    this._SetDescription();
  }
  CalElevation() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #EventMark;
  #map;
  #workouts = [];
  #mapZoom = 13;

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._Submit.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._MovetoPop.bind(this));
    this._GetStorage();
  }
  _Submit(e) {
    e.preventDefault();
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const type = inputType.value;
    const { lat, lng } = this.#EventMark.latlng;
    let workout;
    function ValidNumber(...inputs) {
      return inputs.every(function (i) {
        return Number.isFinite(i);
      });
    }
    function Positive(...inputs) {
      return inputs.every(function (i) {
        return i >= 0;
      });
    }
    if (type === 'running') {
      const cadance = +inputCadence.value;

      if (
        !ValidNumber(duration, distance, cadance) ||
        !Positive(duration, distance, cadance)
      ) {
        return alert('Enter Positive Numbers');
      }
      workout = new Running([lat, lng], distance, duration, cadance);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !ValidNumber(duration, distance, elevation) ||
        !Positive(duration, distance)
      ) {
        return alert('Enter Positive Numbers');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    this.#workouts.push(workout);
    this._RenderingWorkoutMarker(workout);
    this._RenderWorkout(workout);
    this._HideForm();
    this._SetStorage();
  }
  _HideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Could'nt Find Loc");
      }
    );
  }
  _loadMap(loc) {
    const { latitude } = loc.coords;
    const { longitude } = loc.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker(coords).addTo(map).bindPopup().openPopup();
    this.#map.on('click', this._showForm.bind(this));
    this.#workouts.forEach(work => {
      this._RenderingWorkoutMarker(work);
    });
  }
  _showForm(e) {
    this.#EventMark = e;
    inputDistance.focus();
    form.classList.remove('hidden');
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _RenderingWorkoutMarker(workout) {
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
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}${workout.desc} `
      )
      .openPopup();
  }
  _RenderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.desc}</h2>
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
    </div>
    `;
    if (workout.type === 'running')
      html += ` <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace.toFixed(1)}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">🦶🏼</span>
    <span class="workout__value">${workout.cadance.toFixed(1)}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>`;
    else
      html += `<div class="workout__details">
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

    form.insertAdjacentHTML('afterend', html);
  }
  _MovetoPop(e) {
    const workoutEL = e.target.closest('.workout');

    if (!workoutEL) return;

    const workout = this.#workouts.find(function (w) {
      return w.id === workoutEL.dataset.id;
    });
    this.#map.setView(workout.coords, this.#mapZoom, {
      animate: true,
      pan: { duration: 1 },
    });
  }
  _SetStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _GetStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._RenderWorkout(work);
    });
  }
}

const app = new App();
