//tests to check out how js works

var expect = require('expect.js');

describe('JavaScript', function() {
    it('can call base constructor', function() {
        function Base(baseValue) {
            this.baseValue = baseValue;
        }
        Base.prototype.baseValue = 1;

        function Clazz(clazzValue) {
            Base.call(this, clazzValue);
        }
       
        var c1 = new Clazz(2);
        var c2 = new Clazz(3);

        expect(c1.baseValue).to.equal(2);
        expect(c2.baseValue).to.equal(3);
    });

    it('create new base prototype per each object', function() {
        function Base() {}
        Base.prototype.baseValue = undefined;
        Base.prototype.setValue = function(value) {
            this.baseValue = value;
        };

        function Clazz() {}
        Clazz.prototype = new Base();
        
        var c1 = new Clazz();
        c1.setValue(1);

        var c2 = new Clazz();
        c2.setValue(2);

        expect(c1.baseValue).to.equal(1);
        expect(c2.baseValue).to.equal(2);
    });
});
