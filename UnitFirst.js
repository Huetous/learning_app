"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RS_1 = require("./Tasks/UnitFirst/RS");
var G2G_1 = require("./Tasks/UnitFirst/G2G");
var S2G_1 = require("./Tasks/UnitFirst/S2G");
var UnitFirst = /** @class */ (function () {
    function UnitFirst() {
    }
    UnitFirst.getG2Gtest_OneAnswerGraph = function (test_id) {
        return G2G_1.getG2Gtest(test_id, 1);
    };
    UnitFirst.getG2Gtest_TwoAnswerGraph = function (test_id) {
        return G2G_1.getG2Gtest(test_id, 2);
    };
    UnitFirst.getS2Gtest_SimpleFunctions = function (test_id) {
        return S2G_1.getS2Gtest(test_id, 0);
    };
    UnitFirst.getS2Gtest_ComplexFunctions = function (test_id) {
        return S2G_1.getS2Gtest(test_id, 1);
    };
    UnitFirst.getS2Gtest_MixedFunctions = function (test_id, ComplexChance) {
        return S2G_1.getS2Gtest(test_id, ComplexChance);
    };
    UnitFirst.getRStest_SimpleAnswers = function (test_id) {
        return RS_1.getRStest(test_id, true);
    };
    UnitFirst.getRStest_ComplexAnswers = function (test_id) {
        return RS_1.getRStest(test_id, false);
    };
    return UnitFirst;
}());
exports.UnitFirst = UnitFirst;
