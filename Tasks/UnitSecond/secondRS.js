"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../../Config");
var FunctionBuilder_1 = require("../../Function/FunctionBuilder");
var Util_1 = require("../../Util");
// Depending on the parameters, return area under function, or area under function on interval
function getFunctionBehavior(complexFunc, funcNumber) {
    var sec = 0;
    for (var i = 0; i < funcNumber; ++i)
        sec += complexFunc[i].params.len;
    return { behavior: complexFunc[funcNumber].getTextDescription(), sec: sec.toRound() };
}
exports.getFunctionBehavior = getFunctionBehavior;
function getSecondRStest(test_id) {
    var testType = "secondRS", taskConfig = Config_1.Config.Tasks.secondRS, questionCount = Math.round(Util_1.Utils.getRandomFromRange(taskConfig.questionCount[0], taskConfig.questionCount[1])), questionInterval = Config_1.Config.Limits.defaultLength / questionCount, builder = new FunctionBuilder_1.FunctionBuilder();
    var complexFunction, answers, segments, funcBehaviorObj;
    // Cut the interval of function on few parts
    segments = Array();
    for (var i = 0; i < questionCount - 1; i++)
        segments.push(questionInterval);
    segments.push(Config_1.Config.Limits.defaultLength - questionInterval * (questionCount - 1));
    builder.enableAxisFlip();
    complexFunction = builder.getComplexFunction(segments);
    var funcNumber = Math.round(Util_1.Utils.getRandomFromRange(0, questionCount));
    while (complexFunction[funcNumber].params.hasOwnProperty("_connectingLine") === true)
        funcNumber = Math.round(Util_1.Utils.getRandomFromRange(0, questionCount));
    funcBehaviorObj = getFunctionBehavior(complexFunction, funcNumber);
    answers = {
        sec: funcBehaviorObj.sec,
        answer: funcBehaviorObj.behavior,
    };
    // Clear up the parameters of function (deleting unnecessary fields)
    var processedQuestion = Array();
    for (var _i = 0, complexFunction_1 = complexFunction; _i < complexFunction_1.length; _i++) {
        var func = complexFunction_1[_i];
        processedQuestion.push(func.getProcessed());
    }
    return {
        type: testType,
        test_id: test_id,
        title: "",
        question: [{ graph: processedQuestion }],
        answers: [answers],
    };
}
exports.getSecondRStest = getSecondRStest;
