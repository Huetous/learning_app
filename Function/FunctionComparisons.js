"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionComparison = /** @class */ (function () {
    function FunctionComparison(functionObject) {
        this._functionObj = functionObject;
    }
    // xva == va
    FunctionComparison.prototype.equalByTextTo = function (obj) {
        return this._functionObj.getTextDescription() === obj.getTextDescription();
    };
    FunctionComparison.prototype.equalBySignTo = function (obj) {
        var funcObj = this._functionObj;
        if (funcObj === undefined || obj === undefined)
            return false;
        if (funcObj.funcType === obj.funcType) {
            if (funcObj.params.x !== undefined && obj.params.x !== undefined) {
                if ((Math.sign(funcObj.params.x) === Math.sign(obj.params.x)) &&
                    (Math.sign(funcObj.params.v) === Math.sign(obj.params.v)) &&
                    (Math.sign(funcObj.params.a) === Math.sign(obj.params.a)))
                    return true;
            }
            else if (funcObj.params.v !== undefined && obj.params.v !== undefined) {
                if ((Math.sign(funcObj.params.v) === Math.sign(obj.params.v)) &&
                    (Math.sign(funcObj.params.a) === Math.sign(obj.params.a))) {
                    return true;
                }
            }
            else if (funcObj.params.a !== undefined && obj.params.a !== undefined) {
                if ((Math.sign(funcObj.params.a) === Math.sign(obj.params.a)))
                    return true;
            }
        }
        return false;
    };
    FunctionComparison.prototype.equalByValueTo = function (obj) {
        if (obj === undefined)
            return false;
        var funcObj = this._functionObj;
        if (funcObj.funcType === obj.funcType)
            if (funcObj.params.x === obj.params.x &&
                funcObj.params.v === obj.params.v &&
                funcObj.params.a === obj.params.a)
                return true;
        return false;
    };
    FunctionComparison.prototype.equalByDirectionTo = function (obj) {
        // Functions have equal directions when their derivatives have equal sign
        var funcObj = this._functionObj;
        var this_dir, nextFunc_dir;
        switch (obj.funcType) {
            case "x":
                this_dir = funcObj.params.v + funcObj.params.a * funcObj.params.len;
                nextFunc_dir = obj.params.v + obj.params.a * obj.params.len;
                return Math.sign(this_dir) === Math.sign(nextFunc_dir);
            case "v":
                this_dir = funcObj.params.a;
                nextFunc_dir = obj.params.a;
                return Math.sign(this_dir) === Math.sign(nextFunc_dir);
        }
        return false;
    };
    return FunctionComparison;
}());
exports.FunctionComparison = FunctionComparison;
