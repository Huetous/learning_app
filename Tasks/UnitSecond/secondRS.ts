import {FunctionObj} from "../../Function/FunctionObj";
import {Config} from "../../Config";
import {FunctionBuilder} from "../../Function/FunctionBuilder";
import {Utils} from "../../Util";

// Depending on the parameters, return area under function, or area under function on interval
export function getFunctionBehavior(complexFunc: Array<FunctionObj>, funcNumber: number) {
    let sec = 0;
    for (let i = 0; i < funcNumber; ++i)
        sec += complexFunc[i].params.len;
    return {behavior: complexFunc[funcNumber].getTextDescription(), sec: sec.toRound()};
}

export function getSecondRStest(test_id: number) {
    const testType = "secondRS",
        taskConfig = Config.Tasks.secondRS,
        questionCount = Math.round(Utils.getRandomFromRange(taskConfig.questionCount[0], taskConfig.questionCount[1])),
        questionInterval = Config.Limits.defaultLength / questionCount,

        builder = new FunctionBuilder();

    let complexFunction: Array<FunctionObj>,
        answers: any,
        segments: any,
        funcBehaviorObj;

    // Cut the interval of function on few parts
    segments = Array<number>();
    for (let i = 0; i < questionCount - 1; i++)
        segments.push(questionInterval);
    segments.push(Config.Limits.defaultLength - questionInterval * (questionCount - 1));

    builder.enableAxisFlip();
    complexFunction = builder.getComplexFunction(segments);

    let funcNumber = Math.round(Utils.getRandomFromRange(0, questionCount));
    while (complexFunction[funcNumber].params.hasOwnProperty("_connectingLine") === true)
        funcNumber = Math.round(Utils.getRandomFromRange(0, questionCount));
    funcBehaviorObj = getFunctionBehavior(complexFunction, funcNumber);

    answers = {
        sec: funcBehaviorObj.sec,
        answer: funcBehaviorObj.behavior,
    };

    // Clear up the parameters of function (deleting unnecessary fields)
    const processedQuestion = Array<FunctionObj>();
    for (const func of complexFunction)
        processedQuestion.push(func.getProcessed());

    return {
        type: testType,
        test_id: test_id,
        title: "",
        question: [{graph: processedQuestion}],
        answers: [answers],
    };
}

