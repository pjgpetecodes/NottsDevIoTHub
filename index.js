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

for (var i = 1; i < 10; i++)
{
  wpi.digitalWrite(config.RedLED, 1);
  wpi.digitalWrite(config.GreenLED, 1);

  wpi.delay(500);

  wpi.digitalWrite(config.RedLED, 0);
  wpi.digitalWrite(config.GreenLED, 0);

  wpi.delay(500);

}