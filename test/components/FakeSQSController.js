function FakeSQSController(address) {
    this.address = address;

    if(this.getQueue() === undefined)
        this.initQueue();
}

FakeSQSController.queues = {}; 

FakeSQSController.prototype.getQueue = function() {
    return FakeSQSController.queues[this.address];
};

FakeSQSController.prototype.initQueue = function() {
    FakeSQSController.queues[this.address] = [];
};

FakeSQSController.prototype.getMessageLength = function() {
    return this.getQueue().length;
};

FakeSQSController.prototype.readMessage = function(done) {
    var lastMessage = this.getQueue()[0];
    this.getQueue().splice(0, 1);
    done(null, lastMessage);     
};

FakeSQSController.prototype.sendMessage = function(messageBody, done) {
    this.getQueue().push(messageBody); 
    done();
};

module.exports = FakeSQSController;
