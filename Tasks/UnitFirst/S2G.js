"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../../Config");
var Util_1 = require("../../Util");
var FunctionBuilder_1 = require("../../Function/FunctionBuilder");
function getS2Gtest(test_id, chance) {
    var testType = 'S2G', questions = Array(), correctIDs = Array(), answers = Array(), builder = new FunctionBuilder_1.FunctionBuilder(), questionCount = Config_1.Config.Tasks.S2G.questionCount, answersCount = Config_1.Config.Tasks.S2G.answersCount, length = Config_1.Config.Limits.defaultLength;
    var cachedChance, first, second, index, firstText, secondText, text = "";
    for (var i = 0; i < questionCount; ++i) {
        correctIDs.addRandomNumber(answersCount);
        questions[i] = {
            id: i,
            graph: [],
            correctIDs: [correctIDs.last()],
        };
        cachedChance = Util_1.Utils.withChance(chance);
        if (cachedChance) {
            builder.setAllowedAxes(Config_1.Config.getAxesCopy(['a']));
            var complexFunc = builder.getComplexFunction([length / 2, length / 2]);
            questions[i].graph.push(complexFunc[0].getProcessed());
            questions[i].graph.push(complexFunc[1].getProcessed());
        }
        else {
            builder.disableAllowedAxes();
            questions[i].graph.push(builder.getQuestionFunction().getProcessed());
        }
    }
    builder.disableDuplicateText();
    for (var i = 0; i < answersCount; ++i) {
        cachedChance = Util_1.Utils.withChance(chance);
        second = null;
        if (cachedChance)
            builder.setLength(length / 2);
        else
            builder.setLength(0);
        index = correctIDs.indexOf(i);
        first = questions[index].graph[0];
        if (questions[index].graph.length === 2)
            second = questions[index].graph[1];
        if (second) {
            firstText = first.getTextDescription();
            secondText = second.getTextDescription();
            if (firstText === secondText)
                text = "Все время " + firstText;
            else
                text = "Cперва " + firstText + ", затем " + secondText;
        }
        else
            text = first.getTextDescription(true);
        answers[i] = {
            text: text,
            id: i
        };
    }
    return {
        type: testType,
        test_id: test_id,
        title: "",
        question: questions,
        answers: answers.shuffle()
    };
}
exports.getS2Gtest = getS2Gtest;
