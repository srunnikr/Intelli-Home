import spidev
import time
import os
from socketIO_client import SocketIO, LoggingNamespace

spi = spidev.SpiDev()
spi.open(0,1)

def getTempReading(channel):
    # We read the sensor voltage through ADC
    adcValue = spi.xfer2([1, (8+channel) << 4, 0])
    # spidev writes back the data onto same buffer used to send data
    # We have 10-bit resoultion, so 2 bits from first byte and then 8 bits from last
    reading = ((adcValue[1]&3) << 8) + adcValue[2]
    print "Adc reading : ",reading

    # We have put reference voltage as 5V from RPi
    analogVoltage = (reading * 5) / float(1023)
    print "Voltage reading : ",analogVoltage

    tempinC = ((analogVoltage*1000) - 500) / 10
    print "Temperature in C : ",tempinC
    return tempinC

def getDoorStatus(channel):
    # We read the sensor voltage through ADC
    adcValue = spi.xfer2([1, (8+channel) << 4, 0])
    # spidev writes back the data onto same buffer used to send data
    # We have 10-bit resoultion, so 2 bits from first byte and then 8 bits from last
    reading = ((adcValue[1]&3) << 8) + adcValue[2]
    print "Door Adc reading : ",reading

    status = ""
    if(reading < 100):
        print "Door OPENED"
        status = "OPEN"
    else:
        print "Door CLOSED"
        status = "CLOSE"
    return status
    


def main():
	currTemp = getTempReading(0)
        # round it to two decimals
        currTemp = float("{0:.2f}".format(currTemp))
	# Send it to server
	with SocketIO('192.168.1.2', 5000, LoggingNamespace) as socketIO:
		socketIO.emit('tempReading', currTemp)
        door = getDoorStatus(1)
        with SocketIO('192.168.1.2', 5000, LoggingNamespace) as socketIO:
                            socketIO.emit('doorReading', door)

if __name__ == '__main__':
	while True:
		main()
		time.sleep(2)
