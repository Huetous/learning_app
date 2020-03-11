"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var cors = require("cors");
var UnitFirst_1 = require("./UnitFirst");
var UnitSecond_1 = require("./UnitSecond");
var corsHandler = cors({ origin: true });
exports.getTestDevDebug = functions.region("europe-west1").https.onRequest(function (request, resp) {
    return corsHandler(request, resp, function () {
        resp.send(createTest());
    });
});
exports.getTestDev = functions.region("europe-west1").https.onCall(function (data, context) {
    return createTest();
});
function createTest() {
    var testBundle = { tests: Array() };
    testBundle.tests.push(UnitFirst_1.UnitFirst.getG2Gtest_OneAnswerGraph(1));
    testBundle.tests.push(UnitFirst_1.UnitFirst.getG2Gtest_TwoAnswerGraph(2));
    testBundle.tests.push(UnitFirst_1.UnitFirst.getS2Gtest_SimpleFunctions(2));
    testBundle.tests.push(UnitFirst_1.UnitFirst.getS2Gtest_ComplexFunctions(3));
    testBundle.tests.push(UnitFirst_1.UnitFirst.getS2Gtest_MixedFunctions(4, 0.5));
    testBundle.tests.push(UnitFirst_1.UnitFirst.getRStest_SimpleAnswers(6));
    testBundle.tests.push(UnitFirst_1.UnitFirst.getRStest_ComplexAnswers(7));
    testBundle.tests.push(UnitSecond_1.UnitSecond.getSecondRStest(1));
    return JSON.stringify(testBundle);
}
