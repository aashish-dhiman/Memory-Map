"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

/////////////////////////////////////////////////
class Workout {
    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords; //[lat,lng]
        this.distance = distance; //km
        this.duration = duration; //minutes
    }

    _setDescription() {
        // prettier-ignore
        const months = [
            "January","February","March","April","May","June","July","August","September","October","November","December",
        ];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(
            1
        )} on ${this.date.getDate()} ${months[this.date.getMonth()]}`;
    }
}
//////////////////////////////////
class Running extends Workout {
    type = "running";

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }
    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}
// //////////////////////////////
class Cycling extends Workout {
    type = "cycling";
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }
    calcSpeed() {
        this.speed = this.distance / (this.duration / 60); //km/hr
        return this.speed;
    }
}
// const r1 = new Running([73, 82], 83, 93, 29);
// const c1 = new Cycling([73, 82], 83, 93, 29);
// console.log(r1, c1);

///////////////////////////////////////////////////
class App {
    // private fields
    #map;
    #mapEvent;
    #workouts = [];

    constructor() {
        this._getPosition();

        form.addEventListener("submit", this._newWorkout.bind(this));

        inputType.addEventListener("change", this._toggleElevationField);

        containerWorkouts.addEventListener("click", this._movePopup.bind(this));
    }

    //protected fields
    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function () {
                    alert("Please allow location access");
                }
            );
        }
    }
    _loadMap(pos) {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        const coords = [latitude, longitude];

        //displaying map using leaflet library
        // console.log(this);
        this.#map = L.map("map").setView(coords, 15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
            this.#map
        );

        this.#map.on("click", this._showForm.bind(this));
    }

    _showForm(event) {
        this.#mapEvent = event;

        form.classList.remove("hidden");
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputCadence
            .closest(".form__row")
            .classList.toggle("form__row--hidden");
        inputElevation
            .closest(".form__row")
            .classList.toggle("form__row--hidden");
    }

    _newWorkout(e) {
        e.preventDefault();

        //validation helper functions
        const validInputs = (...inputs) =>
            inputs.every((inp) => Number.isFinite(inp));
        const checkPositive = (...inputs) => inputs.every((inp) => inp > 0);

        //get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        if (type === "running") {
            const cadence = +inputCadence.value;

            //data validation
            if (
                !validInputs(distance, duration, cadence) ||
                !checkPositive(distance, duration, cadence)
            )
                return alert("Enter a positive number!");

            workout = new Running([lat, lng], distance, duration, cadence);
        }
        if (type === "cycling") {
            const elevation = +inputElevation.value;
            //data validation
            if (
                !validInputs(distance, duration, elevation) ||
                !checkPositive(distance, duration)
            )
                return alert("Enter a positive number!");

            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        //adding new workout to workouts array
        // console.log(workout);
        this.#workouts.push(workout);

        // display marker
        this._displayMarker(workout);
        //display workout
        this._displayWorkout(workout);
        //hiding the form
        this._hideForm();
    }

    _hideForm() {
        // clearing fields
        inputCadence.value =
            inputDistance.value =
            inputDuration.value =
            inputElevation.value =
                "";

        //hiding the form again
        //trick to not display the animation
        form.style.display = "none";
        form.classList.add("hidden");
        setTimeout(() => (form.style.display = "grid"), 1000);
    }

    _displayMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 50,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type}-popup`,
                })
            )
            .setPopupContent(
                `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${
                    workout.description
                }`
            )
            .openPopup();
    }

    _displayWorkout(workout) {
        let html = `
        <li class="workout workout--${workout.type}" data-id='${workout.id}'>
         <h2 class="workout__title">${workout.description}</h2>
         <div class="workout__details">
         <span class="workout__icon">${
             workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
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

        if (workout.type === "running")
            html += `
        <div class="workout__details">
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

        if (workout.type === "cycling")
            html += `
         <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`;

        //adding html
        form.insertAdjacentHTML("afterend", html);
    }
    _movePopup(e) {
        const workoutEl = e.target.closest(".workout");
        if (!workoutEl) return;
        // console.log(workoutEl);
        const workout = this.#workouts.find(
            (el) => el.id === workoutEl.dataset.id
        );
        this.#map.setView(workout.coords, 15);
    }
}

const app = new App();
