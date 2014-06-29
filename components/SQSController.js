var AWS = require('aws-sdk');
var awsCredentialsPath = './components/aws-sqs-config.json';
var sqsQueueUrl = 'https://sqs.us-west-2.amazonaws.com/983680736795/emilSQS';

AWS.config.loadFromPath(awsCredentialsPath);
var sqsClient = new AWS.SQS().client;

function SQSController() {}

SQSController.prototype.readMessage = function(done) {
    sqsClient.receiveMessage({
        QueueUrl: sqsQueueUrl,
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
    }.bind(this));
};

SQSController.prototype.deleteMessage = function(message) {
    sqsClient.deleteMessage({
        QueueUrl: sqsQueueUrl,
        ReceiptHandle: message.ReceiptHandle
    }, function(err, data) {
        if(err)
            throw new Error(err);
    });
};

SQSController.prototype.sendMessage = function(messageBody, done) {
    console.log('sendMessage', 'start');
    
    sqsClient.sendMessage({
        MessageBody: messageBody,
        QueueUrl: sqsQueueUrl
    }, function(err, data) {
        console.log(err, data);
        
        if (err)
            throw new Error(err);
        else
            done(data);
    });
};

module.exports = SQSController;