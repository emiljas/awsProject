var fs = require("fs");

function FakeSQSController(address) {
    var tmpFileName = '/tmp/' + address.replace(/[\/:.-]/g, '_');

    this.getMessageLength = function() {
        return getQueue().length;
    };

    this.readMessage = function(done) {
        var queue = getQueue();
        var lastMessage;
        if(queue.length === 0)
            lastMessage = null;
        else
            lastMessage = queue.splice(0, 1)[0];
        setQueue(queue);
        done(null, lastMessage);
    };

    this.sendMessage = function(messageBody, done) {
        var queue = getQueue();
        queue.push(messageBody);
        setQueue(queue);
        if(done)
            done();
    };

        function getQueue() {
            var exists = fs.existsSync(tmpFileName);
            return exists ? readQueue() : [];
        }

            function readQueue() {
                var data = fs.readFileSync(tmpFileName, 'utf8');
                return JSON.parse(data);
            }

    this.emptyQueue = function() {
        setQueue([]);
    };

        function setQueue(queue) {
            var data = JSON.stringify(queue);
            fs.writeFileSync(tmpFileName, data);
        }
}


module.exports = FakeSQSController;
