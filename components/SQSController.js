var AWS = require('aws-sdk');
var awsCredentialsPath = './components/aws-sqs-config.json';

//AWS.config.loadFromPath(awsCredentialsPath);
//var sqsClient = new AWS.SQS().client;

function SQSController(address) {
    this.address = address;

    AWS.config.loadFromPath(awsCredentialsPath);
    this.sqsClient = new AWS.SQS().client;
}

SQSController.prototype.readMessage = function(done) {
    this.sqsClient.receiveMessage({
        QueueUrl: this.address,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 600,
        WaitTimeSeconds: 3
    }, function(err, data) {
        if (data.Messages) {
            var message = data.Messages[0];
            var body = JSON.parse(message.Body);
            
            done(message, body);
            this.deleteMessage(message);
        }
        else
            done(null, null);
    }.bind(this));
};

SQSController.prototype.deleteMessage = function(message) {
    this.sqsClient.deleteMessage({
        QueueUrl: this.address,
        ReceiptHandle: message.ReceiptHandle
    }, function(err, data) {
        if(err)
            throw new Error(err);
    });
};

SQSController.prototype.sendMessage = function(messageBody, done) {
    console.log(this.sqsClient);
    this.sqsClient.sendMessage({
        MessageBody: messageBody,
        QueueUrl: this.address
    }, function(err, data) {
        console.log(err, data);
        
        if (err)
            throw new Error(err);
        else
            done(data);
    });
};

//because amazon SQS not working locally - don't know why
var testing = true;
var FakeSQSController = require('../test/components/FakeSQSController.js');

if(testing)
    module.exports = FakeSQSController;
else
    module.exports = SQSController;
