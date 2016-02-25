var d = new Date();
var readings = []
var labels = []

var canvas = document.getElementById('myChart').getContext('2d');

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
	var chartData = {
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
	chart = new Chart(canvas).Line(chartData);
}

function updateTemperature(newValue) {
	document.getElementById("temperatureValue").innerHTML = newValue;

	// Update the temperature data base for the chart

	var current_hour = d.getHours();
	var current_min = d.getMinutes();
	
	// CHeck if we have 100 elements in the array, if so remove the last one
	if(readings.length >= 20) {
		// Remove the last element
		readings.shift();
		readings.push(newValue);
	} else {
		// Ift here are fewer than 100 elements
		readings.push(newValue);
	}

	// Prepare the label to display
	var label = "";
	label += current_hour.toString();
	if(current_hour < 12) {
		label+=":";
		label+=current_min.toString();
		label+="AM";
	} else {
		label+=":";
		label+=current_min.toString();
		label += "PM";
	}

	// Similar to readings check if we have 100 elements at present
	if(labels.length >= 20) {
		// Remove the last element (Here the first item in the array)
		labels.shift();
		labels.push(label);
	} else {
		labels.push(label);
	}
	
	// Update the graph
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