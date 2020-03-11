"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../Config");
// Provides methods to control function behaviour at start, at end and in middle of a segment
var FunctionBehaviour = /** @class */ (function () {
    function FunctionBehaviour(functionObject) {
        this._functionObj = functionObject;
    }
    // Changes the parameters of the this functionObj such as it ENDS at the grid note
    FunctionBehaviour.prototype.snapEnd = function () {
        var funcObj = this._functionObj, funcType = funcObj.funcType, params = funcObj.params, len = funcObj.params.len, X = params.x, V = params.v, A = params.a, value = funcObj.values.calcFinalValue();
        var result = 0;
        // Ending point of function must not be going higher than upper limit
        if (value !== 0)
            result = Math.round(Math.min(Math.abs(value), Config_1.Config.Limits.upperLimit)) * Math.sign(value);
        // Calculates new parameters of function which satisfies an ending point
        switch (funcType) {
            case "x":
                if (V !== 0 && A !== 0) {
                    var new_V = (result - X - (A * len * len) / 2) / len, new_A = 2 * (result - X - V * len) / (len * len), sign_A = Math.sign(A), sign_V = Math.sign(V);
                    if (sign_A === Math.sign(new_A) && sign_V === Math.sign(new_V)) {
                        if (sign_V === 0)
                            params.a = new_A;
                        else
                            params.v = new_V;
                    }
                    else if (sign_A === -Math.sign(new_A))
                        params.v = new_V;
                    else if (sign_V === -Math.sign(new_V))
                        params.a = new_A;
                    else
                        throw Error("Case 'x'. Incorrect composition of params.");
                }
                else if (V !== 0)
                    params.v = (result - X - (A * len * len) / 2) / len;
                else if (A !== 0)
                    params.a = 2 * (result - X - V * len) / (len * len);
                break;
            case "v":
                if (A !== 0)
                    params.a = (result - V) / len;
                break;
        }
        return this;
    };
    // Changes the parameters of the this functionObj such as it STARTS at the grid note
    FunctionBehaviour.prototype.snapBegin = function () {
        var funcObj = this._functionObj, funcType = funcObj.funcType, params = funcObj.params;
        if (funcType === 'x' || funcType === 'v')
            params[funcType] = Math.round(params[funcType]);
        return this;
    };
    // Returns true if function reaches limits inside of segment
    FunctionBehaviour.prototype.isConvex = function (start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = this._functionObj.params.len; }
        var funcObj = this._functionObj, params = funcObj.params, upperLimit = Config_1.Config.Limits.upperLimit;
        var S, E, C, MaxValue;
        // Function value at a start (S) and at an end (E) of segment
        S = funcObj.values.calcFinalValue(start);
        E = funcObj.values.calcFinalValue(end);
        switch (funcObj.funcType) {
            case 'x':
                if (params.a === 0)
                    return Math.abs(S) > upperLimit || Math.abs(E) > upperLimit;
                else {
                    C = -params.v / params.a;
                    MaxValue = funcObj.values.calcFinalValue(C);
                    return Math.abs(S) > upperLimit ||
                        Math.abs(E) > upperLimit ||
                        Math.abs(MaxValue) > upperLimit;
                }
            case 'v':
                return Math.abs(S) > upperLimit || Math.abs(E) > upperLimit;
        }
        return false;
    };
    return FunctionBehaviour;
}());
exports.FunctionBehaviour = FunctionBehaviour;
