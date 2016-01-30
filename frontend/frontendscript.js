$(document).ready( function () {
	// Set the status message to test javascript functionality
	console.log("javascript on");

	// Set default temperature and humidity values
	updateTemperature(23);
	updateHumidity(90);
	updateLampState("ON");
	updateIntrusionState("NOT GOOD");

	// Establish connection via socket io
	var socket = io.connect('127.0.0.1');
}) ;

function updateTemperature(newValue) {
	document.getElementById("temperatureValue").innerHTML = newValue;
}

function updateHumidity(newValue) {
	document.getElementById("humidityValue").innerHTML = newValue;
}

function updateLampState(state) {
	document.getElementById("lampState").innerHTML = state;
}

function updateIntrusionState(state) {
	document.getElementById("intrusionState").innerHTML = state;
}