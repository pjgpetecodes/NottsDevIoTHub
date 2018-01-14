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
wpi.pinMode(0, wpi.OUTPUT);
wpi.pinMode(16, wpi.OUTPUT);

for (var i = 1; i < 10; i++)
{
  wpi.digitalWrite(0, 1);
  wpi.digitalWrite(16, 1);

  wpi.delay(500);

  wpi.digitalWrite(0, 0);
  wpi.digitalWrite(16, 0);

  wpi.delay(500);

}