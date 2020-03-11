"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../../Config");
var FunctionBuilder_1 = require("../../Function/FunctionBuilder");
var Util_1 = require("../../Util");
var FunctionValues_1 = require("../../Function/FunctionValues");
// Depending on the parameters, return one of two possible answer types: S - area under function, Δ - path length
function createAnswers(complexFunc, segments, letter) {
    var leftSegment, rightSegment, leftValue = 0, rightValue = 0, answers = Array();
    for (var i = 0; i < segments.length; ++i) {
        leftSegment = {
            start: segments[i][0][0],
            end: segments[i][0][1],
        };
        rightSegment = {
            start: segments[i][1][0],
            end: segments[i][1][1],
        };
        leftValue = calcTargetFunction(complexFunc, leftSegment, letter);
        rightValue = calcTargetFunction(complexFunc, rightSegment, letter);
        answers[i] = {
            id: i,
            letter: letter,
            leftSegment: [leftSegment.start, leftSegment.end + 1],
            rightSegment: [rightSegment.start, rightSegment.end + 1],
            correctSign: Math.sign(leftValue - rightValue),
        };
    }
    return answers;
}
exports.createAnswers = createAnswers;
// Depending on the parameters, return area under function, or area under function on interval
function calcTargetFunction(complexFunc, segment, letter) {
    var value = 0;
    if (letter === "S")
        value = FunctionValues_1.FunctionValues.calcIntegralOnSegment(segment.start, segment.end, complexFunc);
    else
        value = complexFunc[segment.end].values.calcIntegral();
    return value;
}
exports.calcTargetFunction = calcTargetFunction;
function getRStest(test_id, isSimple) {
    var testType = "relationSings", taskConfig = Config_1.Config.Tasks.RS, questionCount = Math.round(Util_1.Utils.getRandomFromRange(taskConfig.questionCount[0], taskConfig.questionCount[1])), questionInterval = Math.round(Config_1.Config.Limits.defaultLength / questionCount), segments = Array(), answersCount = isSimple ? taskConfig.simple.answersCount : taskConfig.complex.answersCount, builder = new FunctionBuilder_1.FunctionBuilder();
    var complexFunction, answers = Array(), firstSegments, secondSegments;
    // Forbid an usage of axes A
    builder.setAllowedAxes(Config_1.Config.Axes.set.copy().deleteItem("a"));
    // Cut the interval of function on few parts
    for (var i = 0; i < questionCount; i++)
        segments.push(questionInterval);
    complexFunction = builder.getComplexFunction(segments);
    var firstAnswers = Array(), secondAnswers = Array();
    if (!isSimple) {
        var half = answersCount / 2;
        firstSegments = Util_1.Segments.getSegments(questionCount, half);
        firstAnswers = createAnswers(complexFunction, firstSegments, "S");
        secondSegments = Util_1.Segments.getSegments(questionCount, half);
        secondAnswers = createAnswers(complexFunction, secondSegments, "Δ" + complexFunction[0].funcType);
        answers = firstAnswers.concat(secondAnswers);
    }
    else {
        firstSegments = Util_1.Segments.getSegments(questionCount, answersCount);
        answers = createAnswers(complexFunction, firstSegments, "Δ" + complexFunction[0].funcType);
    }
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
        answers: answers.shuffle(),
    };
}
exports.getRStest = getRStest;
