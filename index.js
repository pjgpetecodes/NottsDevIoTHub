'use strict';

var path = require('path');

//
// Load the Config Files
//
try {
  var config = require( path.resolve( __dirname, "./config.json" ) );
  var security = require( path.resolve( __dirname, "./security.json" ) );
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

//
// Setup the IoT Hub Connection
//
var connectionString = 'HostName=' + config.HostName + ';DeviceId=' + config.DeviceId + ';SharedAccessKey=' + security.SharedAccessKey;

// use factory function from AMQP-specific package
var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;

// AMQP-specific factory function returns Client object from core package
var client = clientFromConnectionString(connectionString);

// use Message object from core package
var Message = require('azure-iot-device').Message;

// Setup a Callback for when we're connected to our IoT Hub instance
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {

    console.log('Client connected');
  }

  //
  // Send a Test Message
  //
  var msg = new Message('Test Msg');
        
  client.sendEvent(msg, function (err) {
    if (err) {
      console.log(err.toString());
    } else {
      console.log('Message sent');
    };

  }); // Client.sendEvent

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

}; // var connectCallback

// Open the connection to our IoT Hub and supply our Callback function for when it's connected
client.open(connectCallback);

