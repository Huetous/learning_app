"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionObj_1 = require("./FunctionObj");
var Config_1 = require("../Config");
var Util_1 = require("../Util");
/**
 * Class FunctionBuilder
 *
 * fields:
 *      usedQuestionFuncs - an array which contains of existing question functions
 *      usedCorrectFuncs - an array which contains of existing correct functions
 *      usedIncorrectFuncs - an array which contains of existing incorrect functions
 *
 *      functionLength -
 * */
var FunctionBuilder = /** @class */ (function () {
    function FunctionBuilder() {
        this.usedQuestionFuncs = Array();
        this.usedCorrectFuncs = Array();
        this.usedIncorrectFuncs = Array();
        this.functionLength = Config_1.Config.Limits.defaultLength;
        this.allowedAxes = Config_1.Config.getAxesCopy();
        this.useAllowedAxes = false;
        this.useSnap = false;
        this.allowDuplicateText = true;
        this.flipOnAxis = false;
    }
    //------------------------------------
    // Builder properties
    //------------------------------------
    // Resets all class fields to their default values
    FunctionBuilder.prototype.reset = function () {
        this.usedQuestionFuncs = Array();
        this.usedCorrectFuncs = Array();
        this.usedIncorrectFuncs = Array();
        this.functionLength = Config_1.Config.Limits.defaultLength;
        this.allowedAxes = Config_1.Config.getAxesCopy();
        this.useAllowedAxes = false;
        this.useSnap = false;
        this.allowDuplicateText = true;
        this.flipOnAxis = false;
    };
    // Sets a new value of function length
    FunctionBuilder.prototype.setLength = function (length) {
        if (length < 0 || length > Config_1.Config.Limits.defaultLength)
            throw Error('Parameter <functionLength> must be in [0,' + Config_1.Config.Limits.defaultLength + '].');
        else if (length === 0)
            this.functionLength = Config_1.Config.Limits.defaultLength;
        else
            this.functionLength = length;
        return this;
    };
    // Sets a set of allowed axes
    FunctionBuilder.prototype.setAllowedAxes = function (axises) {
        if (axises.length <= 0)
            throw Error("Available axes array cant be empty!");
        this.allowedAxes = axises.copy();
        this.useAllowedAxes = true;
    };
    // Specifies builder to use only those axes that are listed in config file
    FunctionBuilder.prototype.disableAllowedAxes = function () {
        this.useAllowedAxes = false;
    };
    // Specifies builder to use only those axes that are listed in allowedAxes
    FunctionBuilder.prototype.enableAllowedAxes = function () {
        this.useAllowedAxes = true;
    };
    // Return a copy of a set of allowedAxes
    FunctionBuilder.prototype.getAllowedAxes = function () {
        return this.allowedAxes.copy();
    };
    // Resets field allowedAxes to its default value
    FunctionBuilder.prototype.resetAllowedAxes = function () {
        this.allowedAxes = Config_1.Config.getAxesCopy();
    };
    // Disallows builder to create functions which have identical text description
    FunctionBuilder.prototype.disableDuplicateText = function () {
        this.allowDuplicateText = false;
    };
    // Allows builder to create functions which have identical text description
    FunctionBuilder.prototype.enableDuplicateText = function () {
        this.allowDuplicateText = true;
    };
    // Disallows builder to snap an end and a start of function to a grid note
    FunctionBuilder.prototype.disableSnap = function () {
        this.useSnap = false;
    };
    // Allows builder to snap an end and a start of function to a grid note
    FunctionBuilder.prototype.enableSnap = function () {
        this.useSnap = true;
    };
    // Allows builder to flip function about coordinate axis
    FunctionBuilder.prototype.enableAxisFlip = function () {
        this.flipOnAxis = true;
    };
    // Disallows builder to flip function about coordinate axis
    FunctionBuilder.prototype.disableAxisFlip = function () {
        this.flipOnAxis = false;
    };
    //------------------------------------
    // Methods that returns functions
    //------------------------------------
    // Return a new function object
    FunctionBuilder.prototype.getQuestionFunction = function () {
        var questionObject = this.createQuestionFunction();
        this.usedQuestionFuncs.push(questionObject);
        return questionObject;
    };
    // Return a new correct function
    FunctionBuilder.prototype.getCorrectFunction = function (questionObj) {
        var correctFunction = this.createCorrectFunction(questionObj);
        this.usedCorrectFuncs.push(correctFunction);
        return correctFunction;
    };
    // Return a new incorrect function
    FunctionBuilder.prototype.getIncorrectFunction = function (questionObj) {
        var incorrectFunction = this.createIncorrectFunction(questionObj);
        this.usedIncorrectFuncs.push(incorrectFunction);
        return incorrectFunction;
    };
    // Return a new complex function
    FunctionBuilder.prototype.getComplexFunction = function (functionsLengths) {
        return this.createComplexFunction(functionsLengths);
    };
    //------------------------------------
    // Methods that creates functions
    //------------------------------------
    // Creates a new question function
    FunctionBuilder.prototype.createQuestionFunction = function (recursive_count) {
        if (recursive_count === void 0) { recursive_count = 1; }
        if (recursive_count > 100)
            throw Error('Too many recursive calls');
        var questionFunc = new FunctionObj_1.FunctionObj(this.allowedAxes.getRandom()).generateParams();
        for (var _i = 0, _a = this.usedQuestionFuncs; _i < _a.length; _i++) {
            var func = _a[_i];
            if (questionFunc.comparisons.equalBySignTo(func))
                return this.createQuestionFunction(++recursive_count);
        }
        questionFunc.params.len = this.functionLength;
        questionFunc.behaviour.snapBegin().snapEnd();
        if (questionFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createQuestionFunction(++recursive_count);
        return questionFunc;
    };
    // Creates a new correct function
    FunctionBuilder.prototype.createCorrectFunction = function (questionObj, recursive_count) {
        if (recursive_count === void 0) { recursive_count = 1; }
        if (recursive_count > 150)
            throw Error('Too many recursive calls');
        var correctFunc, pickedAxis, newParams;
        if (this.useAllowedAxes)
            pickedAxis = this.getAllowedAxes().deleteItem(questionObj.funcType).getRandom();
        else {
            pickedAxis = Config_1.Config.getAxesCopy([questionObj.funcType]).getRandom();
        }
        newParams = questionObj.copyParams();
        correctFunc = new FunctionObj_1.FunctionObj(pickedAxis, newParams).makeCorrectParams().clearParams();
        correctFunc.params.len = this.functionLength;
        // Check if new incorrect function is equal to some of already existing by sign
        for (var _i = 0, _a = this.usedCorrectFuncs; _i < _a.length; _i++) {
            var usedCorrectFunc = _a[_i];
            if (correctFunc.comparisons.equalBySignTo(usedCorrectFunc))
                return this.createCorrectFunction(questionObj, ++recursive_count);
        }
        // Check if new incorrect function is equal to some of already existing by text
        if (!this.allowDuplicateText)
            for (var _b = 0, _c = this.usedCorrectFuncs; _b < _c.length; _b++) {
                var usedCorrectFunc = _c[_b];
                if (correctFunc.comparisons.equalByTextTo(usedCorrectFunc))
                    return this.createCorrectFunction(questionObj, ++recursive_count);
            }
        // Snaps function end to a grid node
        if (this.useSnap)
            correctFunc.behaviour.snapEnd();
        if (correctFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createCorrectFunction(questionObj, ++recursive_count);
        return correctFunc;
    };
    // Creates a new incorrect function
    FunctionBuilder.prototype.createIncorrectFunction = function (questionObj, recursive_count) {
        if (recursive_count === void 0) { recursive_count = 1; }
        if (recursive_count > 250)
            throw Error('Too many recursive calls');
        var incorrectFunc, pickedAxis, params = questionObj.copyParams();
        if (this.useAllowedAxes)
            pickedAxis = this.getAllowedAxes().deleteItem(questionObj.funcType).getRandom();
        else
            pickedAxis = Config_1.Config.getAxesCopy([questionObj.funcType]).getRandom();
        incorrectFunc = new FunctionObj_1.FunctionObj(pickedAxis, params).clearParams().makeIncorrectParams().clearParams();
        incorrectFunc.params.len = this.functionLength;
        // Check if new incorrect function is equal to some of already existing by sign
        for (var _i = 0, _a = this.usedIncorrectFuncs; _i < _a.length; _i++) {
            var func = _a[_i];
            if (incorrectFunc.comparisons.equalBySignTo(func))
                return this.createIncorrectFunction(questionObj, ++recursive_count);
        }
        // Snaps function end to a grid node
        if (this.useSnap)
            incorrectFunc.behaviour.snapEnd();
        if (incorrectFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createIncorrectFunction(questionObj, ++recursive_count);
        return incorrectFunc;
    };
    // Creates a new compelx function
    FunctionBuilder.prototype.createComplexFunction = function (funcsLengths) {
        var defaultLength = Config_1.Config.Limits.defaultLength, savedLength = this.functionLength, complexFunc = Array();
        var cumLength = 0;
        // Check if sum of function length are equal to default length listed in config
        for (var _i = 0, funcsLengths_1 = funcsLengths; _i < funcsLengths_1.length; _i++) {
            var length_1 = funcsLengths_1[_i];
            cumLength += length_1;
        }
        if (cumLength > defaultLength)
            throw Error('The sum of functions lengths values greater than ' + defaultLength);
        this.setLength(funcsLengths[0]);
        complexFunc.push(this.getQuestionFunction()); // Start of complex function is questionFunc, so we don`t need to care about duplicates
        for (var i = 1; i < funcsLengths.length; ++i) {
            if (this.flipOnAxis && Util_1.Utils.withChance(0.5)) {
                complexFunc.push(FunctionBuilder.connectingLine(complexFunc.last(), Config_1.Config.Tasks.secondRS.offset));
                funcsLengths[i] -= Config_1.Config.Tasks.secondRS.offset;
            }
            complexFunc.push(this.createNextFunction(complexFunc.last(), funcsLengths[i]));
        }
        this.setLength(savedLength);
        return complexFunc;
    };
    // Connects the gap between two points of a function
    FunctionBuilder.connectingLine = function (prevFunc, lineLen) {
        var startY = prevFunc.values.calcFinalValue(), endY = -startY, line = new FunctionObj_1.FunctionObj("v");
        line.params.v = startY;
        line.params.a = (endY - startY) / lineLen;
        line.params.len = lineLen;
        line.params._connectingLine = true;
        return line;
    };
    // Creates a next part of function for a given one
    FunctionBuilder.prototype.createNextFunction = function (prevFunc, nextFuncLen, recursive_count) {
        if (nextFuncLen === void 0) { nextFuncLen = this.functionLength; }
        if (recursive_count === void 0) { recursive_count = 1; }
        if (recursive_count > 30)
            throw new Error('Too many recursive calls');
        if (!prevFunc.params.len)
            throw new Error("this.params.len is undefined");
        var funcType = prevFunc.funcType, nextFunc = new FunctionObj_1.FunctionObj(funcType).generateParams();
        var prevFuncValue;
        nextFunc.params.len = nextFuncLen;
        prevFuncValue = prevFunc.values.calcFinalValue();
        nextFunc.params[funcType] = prevFuncValue;
        nextFunc.behaviour.snapEnd();
        if (nextFunc.comparisons.equalByDirectionTo(prevFunc))
            return this.createNextFunction(prevFunc, nextFuncLen, ++recursive_count);
        return nextFunc;
    };
    return FunctionBuilder;
}());
exports.FunctionBuilder = FunctionBuilder;
