import sys
import pygal

time = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
		"12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"]

def processTemperature(data):
	# To store the average temperature readings per hour
	hourlyData = [0] * 24
	# The number of temperature readings in the hour
	hourlyDataPoints = [0] * 24

	if len(data) == 0:
		printMessage("No temperature data found")
		return

	for d in data:
		date, temp = d.split("::")
		hour = int(date.split(':')[1])
		temp = float(temp.split(":")[1])
		hourlyData[hour] += temp
		hourlyDataPoints[hour] += 1

	for i in range(0, 24):
		if hourlyDataPoints[i] != 0:
			hourlyData[i] = float("{0:.2f}".format(hourlyData[i] / hourlyDataPoints[i]))

	print hourlyData
	printMessage("Processed temperature data")

	# Generate graphs
	chart = pygal.Bar()
	chart.title = "Mean temperature"
	chart.x_labels = time
	chart.add('temperature (C)', hourlyData)
	chart.render_to_file('temperature.svg')
	#chart.render_to_png('temperature.png')

def processDoorstatus(data):
	# To store the average temperature readings per hour
	doorstatusData = [0] * 24
	
	if len(data) == 0:
		printMessage("No door status data found")
		return

	for d in data:
		date, door = d.split("::")
		hour = int(date.split(':')[1])
		status = door.split(":")[1]
		if status == "OPENED":
			doorstatusData[hour] += 1

	print doorstatusData
	printMessage("Processed door status data")

	# Generate graphs
	chart = pygal.Bar()
	chart.title = "Door status"
	chart.x_labels = time
	chart.add('Door openings (#)', doorstatusData)
	chart.render_to_file('doorstatus.svg')
	#chart.render_to_png('doorstatus.png')

def processData(file_name):
	tempData = []
	doorData = []
	f = open(file_name, 'r')
	lines = f.readlines()
	for line in lines:
		if "T" in line:
			tempData.append(line.strip('\n'))
		elif "D" in line:
			doorData.append(line.strip('\n'))
	printMessage("Segregrated data")
	processTemperature(tempData)
	processDoorstatus(doorData)

def printMessage(msg):
	print "[Intelli-Home] > ",msg

if __name__ == '__main__':
	if len(sys.argv) < 2:
		printMessage("ERROR, wrong number of arguments")
		printMessage("Use : processData <logFile>")
		sys.exit(1)
	else:
		file_name = sys.argv[1]
		processData(file_name)