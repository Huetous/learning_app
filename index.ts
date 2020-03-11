import * as functions from 'firebase-functions';
import * as cors from 'cors';
import { UnitFirst } from './UnitFirst';
import {UnitSecond} from "./UnitSecond";
const corsHandler = cors({ origin: true });

exports.getTestDevDebug = functions.region("europe-west1").https.onRequest((request, resp) => {
  return corsHandler(request, resp, () => {
    resp.send(createTest());
  });
});

exports.getTestDev = functions.region("europe-west1").https.onCall((data, context) => {
  return createTest()
});

function createTest(): any {
  const testBundle = { tests: Array<any>() };

  testBundle.tests.push(UnitFirst.getG2Gtest_OneAnswerGraph(1));
  testBundle.tests.push(UnitFirst.getG2Gtest_TwoAnswerGraph(2));

  testBundle.tests.push(UnitFirst.getS2Gtest_SimpleFunctions(2));
  testBundle.tests.push(UnitFirst.getS2Gtest_ComplexFunctions(3));
  testBundle.tests.push(UnitFirst.getS2Gtest_MixedFunctions(4, 0.5));

  testBundle.tests.push(UnitFirst.getRStest_SimpleAnswers(6));
  testBundle.tests.push(UnitFirst.getRStest_ComplexAnswers(7));
  testBundle.tests.push(UnitSecond.getSecondRStest(1));
  return JSON.stringify(testBundle);
}
