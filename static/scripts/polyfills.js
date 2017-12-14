// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
if (!Array.prototype.reduce) {
    Object.defineProperty(Array.prototype, 'reduce', {
        value: function(callback /*, initialValue*/) {
            if (this === null) {
                throw new TypeError( 'Array.prototype.reduce ' +
                    'called on null or undefined' );
            }
            if (typeof callback !== 'function') {
                throw new TypeError( callback +
                    ' is not a function');
            }

            var o = Object(this);

            var len = o.length >>> 0;

            var k = 0;
            var value;

            if (arguments.length >= 2) {
                value = arguments[1];
            } else {
                while (k < len && !(k in o)) {
                    k++;
                }

                if (k >= len) {
                    throw new TypeError( 'Reduce of empty array ' +
                        'with no initial value' );
                }
                value = o[k++];
            }

            while (k < len) {
                if (k in o) {
                    value = callback(value, o[k], k, o);
                }
                k++;
            }

            return value;
        }
    });
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback/*, thisArg*/) {

        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        var O = Object(this);

        var len = O.length >>> 0;

        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        if (arguments.length > 1) {
            T = arguments[1];
        }
        k = 0;

        while (k < len) {

            var kValue;

            if (k in O) {

                kValue = O[k];

                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}


if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}



if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            var len = o.length >>> 0;

            if (len === 0) {
                return false;
            }

            var n = fromIndex | 0;


            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            while (k < len) {

                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }

            return false;
        }
    });
}