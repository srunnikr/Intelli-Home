$(document).ready( function () {
	// Set the status message to test javascript functionality
	console.log("javascript on");

	// Establish connection via socket io
	var socket = io.connect('127.0.0.1');
}) ;