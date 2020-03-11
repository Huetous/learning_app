"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionValues = /** @class */ (function () {
    function FunctionValues(functionObject) {
        this._functionObj = functionObject;
    }
    // Returns final values of function (function values at end of its length)
    FunctionValues.prototype.calcFinalValue = function (len) {
        var funcObj = this._functionObj, params = funcObj.params, t = len !== undefined ? len : params.len;
        var value;
        switch (funcObj.funcType) {
            case "x":
                value = params.x + params.v * t + (params.a * t * t) / 2;
                return Math.round(value * 100) / 100;
            case "v":
                value = params.v + params.a * t;
                return Math.round(value * 100) / 100;
            case "a":
                value = params.a;
                return Math.round(value * 100) / 100;
        }
        throw Error('Incorrect type of function.');
    };
    // Returns the area under function curve
    FunctionValues.prototype.calcIntegral = function () {
        var funcObj = this._functionObj, params = funcObj.params, X = params.x, V = params.v, A = params.a, L = params.len;
        switch (funcObj.funcType) {
            case "x":
                return X * L + (V * L * L) / 2 + (A * L * L * L) / 6;
            case "v":
                return V * L + (A * L * L) / 2;
        }
        return 0;
    };
    // Returns the area under function curve on segment
    FunctionValues.calcIntegralOnSegment = function (start, end, functions) {
        var result = 0;
        for (var i = start; i < end + 1; i++)
            result += functions[i].values.calcIntegral();
        return result;
    };
    return FunctionValues;
}());
exports.FunctionValues = FunctionValues;
