import {getRStest} from "./Tasks/UnitFirst/RS";
import {getG2Gtest} from "./Tasks/UnitFirst/G2G";
import {getS2Gtest} from "./Tasks/UnitFirst/S2G";

export class UnitFirst {

    static getG2Gtest_OneAnswerGraph(test_id: number) {
        return getG2Gtest(test_id, 1);
    }

    static getG2Gtest_TwoAnswerGraph(test_id: number) {
        return getG2Gtest(test_id, 2);
    }

    static getS2Gtest_SimpleFunctions(test_id: number) {
        return getS2Gtest(test_id, 0);
    }

    static getS2Gtest_ComplexFunctions(test_id: number) {
        return getS2Gtest(test_id, 1);
    }

    static getS2Gtest_MixedFunctions(test_id: number, ComplexChance: number) {
        return getS2Gtest(test_id, ComplexChance);
    }

    static getRStest_SimpleAnswers(test_id: number) {
        return getRStest(test_id, true);
    }

    static getRStest_ComplexAnswers(test_id: number) {
        return getRStest(test_id, false);
    }
}
