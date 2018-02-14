'use strict';

var azure = require('azure-sb');

var connectionString = 'Endpoint=sb://nottsdevsb.servicebus.windows.net/;SharedAccessKeyName=criticalqueuereader;SharedAccessKey=NcH5dtTyfkqI7IdmpCzPqLvaNmkwPeoWSK6J51BRvAo=';
var queueName = 'criticalqueue';

var serviceBusService = azure.createServiceBusService(connectionString);

setInterval(function() {serviceBusService.receiveQueueMessage(queueName, function(error, receivedMessage) {
    if(!error){
        // Message received and deleted
        console.log(receivedMessage);
    } else { console.log(error); }
    });
}, 3000);
