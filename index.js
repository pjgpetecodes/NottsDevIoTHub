'use strict';

var path = require('path');

//
// Load the Config Files
//
try {
  var config = require( path.resolve( __dirname, "./config.json" ) );
} catch (err) {
  console.error('Failed to load config files: ' + err.message);
  return;
}

//
// Setup the IO
//

// Include Wiring Pi for our IO
const wpi = require('wiring-pi');

// Setup the Wiring Pi System
wpi.setup('wpi');

// Setup our LED Pin
wpi.pinMode(config.RedLED, wpi.OUTPUT);
wpi.pinMode(config.GreenLED, wpi.OUTPUT);

// Setup a Callback for when we're connected to our IoT Hub instance
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {

    console.log('Client connected');

}; // var connectCallback

while (true)
{

  if (wpi.digitalRead(config.ButtonPin) == 1)
  {
    wpi.digitalWrite(config.RedLED, 0);
    wpi.digitalWrite(config.GreenLED, 0);
  }
  else
  {
    wpi.digitalWrite(config.RedLED, 1);
    wpi.digitalWrite(config.GreenLED, 1);
  }

}