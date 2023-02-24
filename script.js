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

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;
            // console.log(pos);
            // console.log(latitude);
            // console.log(longitude);
            const coords = [latitude, longitude];
            //displaying map using leaflet library
            const map = L.map("map").setView(coords, 15);

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
                map
            );

            L.marker(coords)
                .addTo(map)
                .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
                .openPopup();
        },
        function () {
            alert("Please allow location access");
        }
    );
}
