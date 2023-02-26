"use strict";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
    // private fields
    #map;
    #mapEvent;

    constructor() {
        this._getPosition();

        form.addEventListener("submit", this._newWorkout.bind(this));

        inputType.addEventListener("change", this._toggleElevationField);
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

        // clearing fields
        inputCadence.value =
            inputDistance.value =
            inputDuration.value =
            inputElevation.value =
                "";
        // display marker
        const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng])
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 50,
                    autoClose: false,
                    closeOnClick: false,
                    className: "running-popup",
                })
            )
            .setPopupContent("Working")
            .openPopup();

        form.classList.add("hidden");
    }
}

const app = new App();
