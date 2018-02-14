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

var initConfigChange = function(twin) {
  var currentTelemetryConfig = twin.properties.reported.telemetryConfig;
  currentTelemetryConfig.pendingConfig = twin.properties.desired.telemetryConfig;
  currentTelemetryConfig.status = "Pending";

  var patch = {
  telemetryConfig: currentTelemetryConfig
  };
  twin.properties.reported.update(patch, function(err) {
      if (err) {
          console.log('Could not report properties');
      } else {
          console.log('Reported pending config change: ' + JSON.stringify(patch));
          setTimeout(function() {completeConfigChange(twin);}, 60000);
      }
  });
}

var completeConfigChange =  function(twin) {
  var currentTelemetryConfig = twin.properties.reported.telemetryConfig;
  currentTelemetryConfig.configId = currentTelemetryConfig.pendingConfig.configId;
  currentTelemetryConfig.sendFrequency = currentTelemetryConfig.pendingConfig.sendFrequency;
  currentTelemetryConfig.status = "Success";
  delete currentTelemetryConfig.pendingConfig;

  var patch = {
      telemetryConfig: currentTelemetryConfig
  };
  patch.telemetryConfig.pendingConfig = null;

  twin.properties.reported.update(patch, function(err) {
      if (err) {
          console.error('Error reporting properties: ' + err);
      } else {
          console.log('Reported completed config change: ' + JSON.stringify(patch));
      }
  });
};

// Setup a Callback for when we're connected to our IoT Hub instance
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {
    console.log('Client connected');
  }

  // Import the BME280 Controller
  var raspberry = require('./raspberry');    
  
  // Import the Microbit Controller
  var microbit = require('./microbit');    
  
  client.getTwin(function(err, twin) {
    if (err) {
        console.error('could not get twin');
    } else {
        /* var patch = {
            location: 'home'
        };

        twin.properties.reported.update(patch, function(err) {
            if (err) {
                console.error('could not update twin');
            } else {
                console.log('twin state reported');                
            }
        }); */

      twin.properties.reported.telemetryConfig = {
          configId: "0",
          sendFrequency: "24h"
      }
      twin.on('properties.desired', function(desiredChange) {
          console.log("received change: "+JSON.stringify(desiredChange));
          var currentTelemetryConfig = twin.properties.reported.telemetryConfig;
          if (desiredChange.telemetryConfig && desiredChange.telemetryConfig.configId !== currentTelemetryConfig.configId) {
              initConfigChange(twin);
          }
      });
    }
    });

  client.on('message', function (msg) {
    client.complete(msg);

    console.log("\x1b[0m",'Command = ' + msg.data);
    
    switch (msg.data.toString())
    {

      case 'RedLED':

        console.log("\x1b[31m",'FLash Red LED');
        blinkLED(config.RedLED);
        break;

      case 'GreenLED':

        console.log("\x1b[32m",'Flash Green LED');
        blinkLED(config.GreenLED);
        break;     

    }

    console.log("\x1b[0m", '------------------');

  });

  //
  // the IoT Hub has requested some readings
  //
  function onGetReadings(request, response) {
    console.log(request.payload);

    blinkLED(config.RedLED);
    blinkLED(config.GreenLED);
    
    //var sensorData = raspberry.getSensorData();
    var sensorData = microbit.getSensorData();
    
    //var msg = new Message('Temperature = ' + sensorData.temperature + " Humidity = " + sensorData.humidity + " Button = " + wpi.digitalRead(11));
    var msg = new Message('Light Level = ' + sensorData.lightlevel + " Compass = " + sensorData.compass + " Acceleration = " + sensorData.acceleration + " Temperature = " + sensorData.temperature);

    if (sensorData.temperature > 25) 
    {
      msg.properties.add('level', 'critical');
    }
    else
    {
      msg.properties.add('level', 'normal');
    }

    response.send(200, msg, function(err) {
        if(err) {
            console.error('An error ocurred when sending a method response:\n' + err.toString());
        } else {
            console.log('Response to method \'' + request.methodName + '\' sent successfully.' );
        }
    });
  }

  client.onDeviceMethod('getReadings', onGetReadings);

  wpi.wiringPiISR(config.ButtonPin, wpi.INT_EDGE_FALLING, function(delta) {
    
    var interrupt_time = wpi.millis();

    // If interrupts come faster than 200ms, assume it's a bounce and ignore
    if (interrupt_time - last_interrupt_time > 200) 
    {
      
      //var sensorData = raspberry.getSensorData();
      var sensorData = microbit.getSensorData();
    
      //var msg = new Message('Temperature = ' + sensorData.temperature + " Humidity = " + sensorData.humidity + " Button = " + wpi.digitalRead(11));
      var msg = new Message('Light Level = ' + sensorData.lightlevel + " Compass = " + sensorData.compass + " Acceleration = " + sensorData.acceleration + " Temperature = " + sensorData.temperature);

      if (sensorData.temperature > 25) 
      {
        msg.properties.add('level', 'critical');
      }
      else
      {
        msg.properties.add('level', 'normal');
      }

      client.sendEvent(msg, function (err) {
        if (err) {
          console.log(err.toString());
        } else {
          console.log('Message sent');
          //process.exit()
        };

      }); // Client.sendEvent
  

      last_interrupt_time = interrupt_time;

    }; // if (interrupt...)

  });  

}; // var connectCallback

// Open the connection to our IoT Hub and supply our Callback function for when it's connected
client.open(connectCallback);

//
// Blink the given LED
//
function blinkLED(PinToBlink) {
  // Light up LED for 500 ms
  wpi.digitalWrite(PinToBlink, 1);
  setTimeout(function () {
    wpi.digitalWrite(PinToBlink, 0);
  }, 500);
}