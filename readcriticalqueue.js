'use strict';

var azure = require('azure-sb');

var connectionString = '';
var queueName = '';

var serviceBusService = azure.createServiceBusService(connectionString);

setInterval(function() {serviceBusService.receiveQueueMessage(queueName, function(error, receivedMessage) {
    if(!error){
        // Message received and deleted
        console.log(receivedMessage);
    } else { console.log(error); }
    });
}, 3000);
