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

let map, mapEvent;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;

            const coords = [latitude, longitude];

            //displaying map using leaflet library
            map = L.map("map").setView(coords, 15);

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
                map
            );

            map.on("click", function (event) {
                // console.log(event);
                mapEvent = event;

                form.classList.remove("hidden");
                inputDistance.focus();
            });
        },
        function () {
            alert("Please allow location access");
        }
    );
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // clearing fields
    inputCadence.value =
        inputDistance.value =
        inputDuration.value =
        inputElevation.value =
            "";
    // display marker
    const { lat, lng } = mapEvent.latlng;
    L.marker([lat, lng])
        .addTo(map)
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
});

inputType.addEventListener("change", function () {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});
