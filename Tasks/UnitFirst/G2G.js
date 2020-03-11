"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../../Config");
var FunctionBuilder_1 = require("../../Function/FunctionBuilder");
function getG2Gtest(test_id, correctAnswersCount) {
    var testType = correctAnswersCount === 1 ? 'G2G' : "G2G2", answersCount = Config_1.Config.Tasks.G2G.answersCount, builder = new FunctionBuilder_1.FunctionBuilder(), answers = Array(), questionObj = builder.getQuestionFunction(), question = {
        graph: [questionObj.getProcessed()],
        correctIDs: Array()
    };
    builder.disableAllowedAxes();
    for (var i = 0; i < correctAnswersCount; ++i)
        answers.push({
            graph: [builder.getCorrectFunction(questionObj).getProcessed()],
            id: question.correctIDs.addRandomNumber(answersCount)
        });
    for (var i = 0; i < answersCount; ++i)
        if (!question.correctIDs.contains(i))
            answers.push({
                graph: [builder.getIncorrectFunction(questionObj).getProcessed()],
                id: i
            });
    return {
        type: testType,
        test_id: test_id,
        question: question,
        answers: answers.shuffle()
    };
}
exports.getG2Gtest = getG2Gtest;
