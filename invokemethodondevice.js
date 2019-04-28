'use strict';

var Client = require('azure-iothub').Client;

var connectionString = '';
var methodName = 'getReadings';
var deviceId = 'NottsDevIoTDevice';

var client = Client.fromConnectionString(connectionString);

var methodParams = {
    methodName: methodName,
    payload: 'hello world',
    timeoutInSeconds: 30
};

client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
    if (err) {
        console.error('Failed to invoke method \'' + methodName + '\': ' + err.message);
    } else {
        console.log(methodName + ' on ' + deviceId + ':');
        console.log(JSON.stringify(result, null, 2));
    }
});