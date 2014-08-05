var SQSController = require('./SQSController.js');

var address = 'https://sqs.us-west-2.amazonaws.com/983680736795/emilSQS';

function PictureSQSController() {
   SQSController.call(this, address); 
}

PictureSQSController.prototype = new SQSController();

module.exports = PictureSQSController;
