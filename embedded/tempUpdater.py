#import spidev
import time
import os
from socketIO_client import SocketIO, LoggingNamespace

temp = 0
print temp

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

def main():
	# currTemp = getTempReading(0)
	# Send it to server
	global temp
	with SocketIO('localhost', 3000, LoggingNamespace) as socketIO:
		socketIO.emit('tempReading', temp)
	temp += 1
	if temp > 30:
		temp = 0

if __name__ == '__main__':
	while True:
		main()
		time.sleep(2)