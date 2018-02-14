'use strict';

var serialport = require('serialport');// include the library
var PortName = "/dev/ttyACM0";

var myPort = new serialport(PortName, {
    baudRate:115200    
})

var ReadLine = serialport.parsers.Readline;
var parser = new ReadLine();

var lightLevel = 0;
var compass = 0;
var acceleration = 0;
var temperature = 0;
var signalStrength = 0;

myPort.pipe(parser);

myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

var microbit = exports;

microbit.getSensorData = function() {
    
    var sensorJson = JSON.stringify({'lightlevel': lightLevel, 'compass': compass, 'acceleration': acceleration, "temperature": temperature, "signalstrength": signalStrength});
    return JSON.parse(sensorJson);
}

function showPortOpen() {
    console.log( myPort.portName + ' port open. Data rate: ' + myPort.baudRate);
}
  
function readSerialData(data) {
    console.log(data);

    var readings;

    try
    {

        readings = JSON.parse(data);
        lightLevel = readings.lightlevel;
        compass = readings.compass;
        acceleration = readings.acceleration;
        temperature = readings.temperature;
        signalStrength = readings.signalstrength;

        console.log("Light Level = " + lightLevel);
        console.log("Compass = " + compass);
        console.log("Acceleration = " + acceleration);
        console.log("Temperature = " + temperature);
        console.log("Signal Strength = " + signalStrength);
    
    } catch (err)
    {
        console.log(err);
    }
    
}
  
function showPortClose() {
   console.log('port closed.');
}
  
function showError(error) {
   console.log('Serial port error: ' + error);
}