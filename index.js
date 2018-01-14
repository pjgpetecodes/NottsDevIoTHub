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

// Setup our button Debounce Timer
var last_interrupt_time = 0;

// Setup a Callback for when we're connected to our IoT Hub instance
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {

    console.log('Client connected');
  }

  wpi.wiringPiISR(config.ButtonPin, wpi.INT_EDGE_FALLING, function(delta) {
    
    var interrupt_time = wpi.millis();

    // If interrupts come faster than 200ms, assume it's a bounce and ignore
    if (interrupt_time - last_interrupt_time > 200) 
    {
      
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

      last_interrupt_time = interrupt_time;

    }; // if (interrupt...)

  });  

}; // var connectCallback

// Open the connection to our IoT Hub and supply our Callback function for when it's connected
client.open(connectCallback);