var d = new Date();
var readings = [12.3, 14.5, 22.3, 11.4, 14.6]
var labels = ['12PM', '1PM', '2PM', '3PM', '4PM']

$(document).ready( function () {
	// Set the status message to test javascript functionality
	console.log("javascript on");

	// Set default temperature and humidity values
	updateTemperature(23);
	updateHumidity(90);
	updateLampState("ON");
	updateIntrusionState("NOT GOOD");
	drawGraph(readings, labels);

	// Establish connection via socket io
	var socket = io.connect('127.0.0.1');

	socket.on('tempUpdate', function(data) {
		var tempValue = data.value;
		updateTemperature(tempValue);
	});

	socket.on('humUpdate', function(data) {
		var humValue = data.value;
		updateHumidity(humValue);
	});

	socket.on('lampUpdate', function(data) {
		var lampValue = data.value;
		updateLampState(lampValue);
	});

	socket.on('intrusionUpdate', function(data) {
		var intrusionValue = data.value;
		updateIntrusionState(intrusionValue);
	});

});

function drawGraph(data, labels) {
	var buyerData = {
			labels : labels,
			datasets : [
				{
					fillColor : "rgba(172,194,132,0.4)",
					strokeColor : "#ACC26D",
					pointColor : "#fff",
					pointStrokeColor : "#9DB86D",
					data : data
				}
			]
		}
	var buyers = document.getElementById('myChart').getContext('2d');
    new Chart(buyers).Line(buyerData);
}

function updateTemperature(newValue) {
	document.getElementById("temperatureValue").innerHTML = newValue;

	// Update the temperature data base for the chart
	readings.push(newValue);
	var current_hour = d.getHours();
	var label = "";
	label += current_hour.toString();
	if(current_hour < 12) {
		label+="AM";
	} else {
		label += "PM";
	}
	labels.push(label);
	drawGraph(readings, labels);
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