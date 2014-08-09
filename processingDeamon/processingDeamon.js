var waitTimeInMilliseconds = 1000;

var fun = function() {
    var x = Math.random();
    if(x > 0.9)
        throw new Error(x);
    else {
        console.log(x);
        setTimeout(fun, waitTimeInMilliseconds);
    }
};

setTimeout(fun, waitTimeInMilliseconds);
