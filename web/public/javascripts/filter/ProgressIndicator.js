function ProgressIndicator(options) {
    this.options = options;
}

ProgressIndicator.prototype.waitForProcessing = function() {
    this.loaderCharCounter = 0;
    this.waitIntervalId = setInterval(function(self) { 
        self.waitForProcessingStep(); 
    }, this.options.animationInterval, this);
};

ProgressIndicator.prototype.waitForProcessingStep = function() {
    var animation = this.options.waitForProcessingMessage + " ";
    
    for(var i = 0; i < this.options.loaderCharCount; i++)
        animation += i > this.loaderCharCounter ? "&nbsp" : "*";

    this.onAnimationChanged(animation);

    var isLastLoaderChar = this.loaderCharCounter === this.options.loaderCharCount - 1;
    this.loaderCharCounter = isLastLoaderChar ? 0 : ++this.loaderCharCounter;
};

ProgressIndicator.prototype.done = function() {
    clearInterval(this.waitIntervalId);
};

module.exports = ProgressIndicator;
