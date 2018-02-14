'use strict';

var EventHubClient = require('azure-event-hubs').Client;

var connectionString = 'HostName=NottsDevIoTHub1.azure-devices.net;SharedAccessKeyName=DeviceExplorer;SharedAccessKey=+XJBxl+/tuiJ3lxe0xW0Uq1xL4yapz1IhmRMNokVPd4=';

var printError = function (err) {
    console.log(err.message);
  };
  
var printMessage = function (message) {
    
    var buf = message.body;
    var messageString = String.fromCharCode.apply(null, new Uint16Array(buf));
    
    console.log('Message received: ');
    
    console.log(messageString);

    if (message.applicationProperties)
    {
        console.log('Temperature Level = ' + message.applicationProperties.level);
    }
    
    console.log('');
  };

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);
