'use strict';

var azure = require('azure-sb');

var connectionString = 'Endpoint=sb://nottsdevservicebus.servicebus.windows.net/;SharedAccessKeyName=ReadCriticalQueue;SharedAccessKey=QLxHMD+hTHm+Y4Ra7aF53StGGt8Lkag7CUpBZVgiYqc=';
var queueName = 'criticalqueue';

var serviceBusService = azure.createServiceBusService(connectionString);

setInterval(function() {serviceBusService.receiveQueueMessage(queueName, function(error, receivedMessage) {
    if(!error){
        // Message received and deleted
        console.log(receivedMessage);
    } else { console.log(error); }
    });
}, 3000);
