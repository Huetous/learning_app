"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Config_1 = require("../Config");
var FunctionComparisons_1 = require("./FunctionComparisons");
var FunctionValues_1 = require("./FunctionValues");
var FunctionBehaviour_1 = require("./FunctionBehaviour");
var FunctionObj = /** @class */ (function () {
    function FunctionObj(_funcType, _params) {
        if (_params === void 0) { _params = {}; }
        this.behaviour = new FunctionBehaviour_1.FunctionBehaviour(this);
        this.comparisons = new FunctionComparisons_1.FunctionComparison(this);
        this.values = new FunctionValues_1.FunctionValues(this);
        this.funcType = _funcType;
        this.params = _params;
    }
    //-------------------------------------------
    // Operations with function parameters
    //-------------------------------------------
    FunctionObj.prototype.clearParams = function () {
        // Takes type of function and deletes unnecessary params for that type
        switch (this.funcType) {
            case "x":
                break;
            case "v":
                delete this.params.x;
                break;
            case "a":
                delete this.params.x;
                delete this.params.v;
                break;
        }
        return this;
    };
    FunctionObj.prototype.makeFreeVariables = function () {
        var paramsKeys = Object.keys(this.params), params = this.params, Axes = Config_1.Config.Axes;
        // Imputes necessary parameters for that type of function
        if (this.funcType === "x") {
            if (!paramsKeys.contains("x"))
                params.x = Util_1.Utils.getRandomOrZeroFromBound(Axes.X);
            if (!paramsKeys.contains("v"))
                params.v = Util_1.Utils.getRandomOrZeroFromBound(Axes.V);
        }
        if (this.funcType === "v")
            if (!paramsKeys.contains("v"))
                params.v = Util_1.Utils.getRandomOrZeroFromBound(Axes.V);
        return this;
    };
    FunctionObj.prototype.generateParams = function () {
        var x, v, a = 0;
        var Axes = Config_1.Config.Axes;
        x = Util_1.Utils.getRandomOrZeroFromBound(Axes.X);
        v = Util_1.Utils.getRandomOrZeroFromBound(Axes.V);
        if (Util_1.Utils.withChance(0.7))
            a = Util_1.Utils.getRandomOrZeroFromBound(Axes.A);
        if (x === 0 && v === 0 && a === 0)
            return this.generateParams();
        if (Math.sign(v) === Math.sign(a)) {
            if (Util_1.Utils.withChance(0.5)) {
                if (v !== 0)
                    v = -v;
            }
            else if (a !== 0)
                a = -a;
        }
        this.params = { "x": x, "v": v, "a": a };
        return this.clearParams();
    };
    FunctionObj.prototype.copyParams = function () {
        return Object.assign({}, this.params);
    };
    FunctionObj.prototype.makeCorrectParams = function () {
        return this.makeFreeVariables();
    };
    // Invert from 1 to all params of function
    FunctionObj.prototype.makeIncorrectParams = function () {
        var params = this.params, paramsKeys = Object.keys(params).deleteItem("len").shuffle();
        var changes = (paramsKeys.length + 1).getRandom(); // get number of changes
        for (var _i = 0, paramsKeys_1 = paramsKeys; _i < paramsKeys_1.length; _i++) {
            var key = paramsKeys_1[_i];
            switch (Math.sign(params[key])) {
                case 1:
                case -1:
                    params[key] = Util_1.Utils.withChance(0.5) ? -params[key] : 0;
                    break;
                case 0:
                    params[key] = Util_1.Utils.withChance(0.5) ? 1 : -1;
                    break;
            }
            params[key] = Util_1.Utils.getRandomWithSign(key, params[key]);
            if (--changes < 0)
                break;
        }
        return this.makeFreeVariables();
    };
    //-------------------------------------------
    // Text description of function behaviour
    //-------------------------------------------
    FunctionObj.prototype.getKeyByValue = function (object, value) {
        // Returns text by value or sign
        var _key = Object.keys(object).find(function (key) { return object[key] === value; });
        if (_key)
            return _key;
        else
            throw Error("Key is not found!");
    };
    // Returns description of function behaviour by its parameters
    // withUpperCase - is string should start with uppercase letter
    FunctionObj.prototype.getTextDescription = function (withUpperCase) {
        var _this = this;
        if (withUpperCase === void 0) { withUpperCase = false; }
        var params = this.params, textOf = Config_1.Config.TextDescription, X = params.x, V = params.v, A = params.a, getText = function (s, v) { return _this.getKeyByValue(s, v); };
        var text = "";
        if (X !== undefined && V !== undefined && A !== undefined) {
            if (X === 0 && V === 0 && A === 0) {
                text += getText(textOf.movement, 0);
                text += ' ' + getText(textOf.position, 0);
            }
            else if (X !== 0 && V === 0 && A === 0) {
                text += getText(textOf.movement, 0);
                text += ' ' + getText(textOf.position, Math.sign(X));
            }
            else {
                //IDENTICAL BLOCK #1
                if (V !== 0)
                    if (A !== 0) {
                        text += getText(textOf.movement, 1);
                        text += ' ' + getText(textOf.directions, Math.sign(V));
                        text += ', ' + getText(textOf.how, Math.sign(A));
                    }
                    else {
                        text += getText(textOf.movement, 1);
                        text += ' ' + getText(textOf.how, 0);
                    }
                else if (A !== 0) {
                    text += getText(textOf.movement, 1);
                    text += ' ' + getText(textOf.directions, 0);
                    text += ' ' + getText(textOf.how, Math.sign(A));
                }
                else {
                    text += getText(textOf.movement, 0);
                    text += ' ' + getText(textOf.position, 0);
                }
            }
        }
        else if (V !== undefined && A !== undefined) {
            //IDENTICAL BLOCK #2
            if (V !== 0)
                if (A !== 0) {
                    text += getText(textOf.movement, 1);
                    text += ' ' + getText(textOf.directions, Math.sign(V));
                    text += ', ' + getText(textOf.how, Math.sign(A));
                }
                else {
                    text += getText(textOf.movement, 1);
                    text += ' ' + getText(textOf.how, 0);
                }
            else if (A !== 0) {
                text += getText(textOf.movement, 1);
                text += ' ' + getText(textOf.directions, 0);
                text += ' ' + getText(textOf.how, Math.sign(A));
            }
            else
                text += getText(textOf.movement, 0);
        }
        else if (A !== undefined) {
            text += getText(textOf.movement, 1);
            text += ' ' + getText(textOf.how, Math.sign(A));
        }
        else
            throw new Error('Incorrect function type.');
        if (withUpperCase) {
            if (text[0] === ' ')
                text = text.substr(1);
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    };
    // Return the function without unnecessary fields
    FunctionObj.prototype.getProcessed = function () {
        var processedFunc = new FunctionObj(this.funcType, this.params);
        delete processedFunc.behaviour;
        delete processedFunc.values;
        delete processedFunc.comparisons;
        return processedFunc;
    };
    return FunctionObj;
}());
exports.FunctionObj = FunctionObj;
