var expect = require('expect.js');
var FakeSQSController = require('./FakeSQSController.js');

describe('FakeSQSController', function() {
   it('send message and then read in correct order', function(done) {
        var fake = new FakeSQSController('http://test2-queue.com');

        fake.sendMessage('a', function() {

            expect(fake.getMessageLength()).to.equal(1);

            fake.sendMessage('b', function() {

                expect(fake.getMessageLength()).to.equal(2);

                fake.readMessage(function(message, body) {
                    
                    expect(body).to.equal('a');  
                    expect(fake.getMessageLength()).to.equal(1);

                    fake.readMessage(function(message, body) {

                        expect(body).to.equal('b');
                        expect(fake.getMessageLength()).to.equal(0);
                        done();

                    });
                }); 
            });
        });    
    });

    it('send message to correct queue', function(done) {
        var fake1 = new FakeSQSController('http://first-queue');
        var fake2 = new FakeSQSController('http://second-queue');

        fake1.sendMessage('message to first queue', function() {
            fake2.sendMessage('message to second queue', function() {
                expect(fake1.getMessageLength()).to.equal(1);
                expect(fake1.getMessageLength()).to.equal(1);
                done();
            });
        });            
    });
 }); 
