var expect = require('expect.js');
var ProgressIndicator = require('../../../web/public/javascripts/filter/ProgressIndicator.js');

describe('ProgressIndicator', function() {
    it('show animation while waiting for processing', function(done) {
        var animations = [];
        var indicator = new ProgressIndicator({
            waitForProcessingMessage: 'wait for processing',
            animationInterval: 1,
            loaderCharCount: 3
        });
        indicator.onAnimationChanged = function(animation) {
            animations.push(animation);
        };

        indicator.waitForProcessing();

        setTimeout(function() {
            expect(animations[0]).to.equal("wait for processing *&nbsp&nbsp");
            expect(animations[1]).to.equal("wait for processing **&nbsp");
            expect(animations[2]).to.equal("wait for processing ***");
            expect(animations[3]).to.equal("wait for processing *&nbsp&nbsp");
            expect(animations[4]).to.equal("wait for processing **&nbsp");
            done();
        }, 150);
    });

    it('stop animation while processing is done', function(done) {
        var animationWorking;
        var indicator = new ProgressIndicator({
            waitForProcessingMessage: 's',
            animationInterval: 1,
            loaderCharCount: 3
        });
        indicator.onAnimationChanged = function(animation) {
            animationWorking = true;
        };
        indicator.waitForProcessing();
        setTimeout(function() {
            indicator.done();
            animationWorking = false;
            setTimeout(function() {
                expect(animationWorking).to.equal(false);
                done();
            }, 5);
        }, 5);
    });
});
