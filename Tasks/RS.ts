import {FunctionObj} from "../../Function/FunctionObj";
import {Config} from "../../Config";
import {FunctionBuilder} from "../../Function/FunctionBuilder";
import {Utils, Segments} from "../../Util";
import {FunctionValues} from "../../Function/FunctionValues";


// Depending on the parameters, return one of two possible answer types: S - area under function, Δ - path length
export function createAnswers(complexFunc: Array<FunctionObj>, segments: Array<Array<Array<number>>>, letter: string) {
    let leftSegment: any,
        rightSegment: any,

        leftValue = 0,
        rightValue = 0,

        answers = Array<any>();

    for (let i = 0; i < segments.length; ++i) {
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

    return answers
}

// Depending on the parameters, return area under function, or area under function on interval
export function calcTargetFunction(complexFunc: Array<FunctionObj>, segment: any, letter: string) {
    let value = 0;
    if (letter === "S")
        value = FunctionValues.calcIntegralOnSegment(segment.start, segment.end, complexFunc);
    else
        value = complexFunc[segment.end].values.calcIntegral();
    return value
}

export function getRStest(test_id: number, isSimple: boolean) {
    const testType = "relationSings",

        taskConfig = Config.Tasks.RS,
        questionCount = Math.round(Utils.getRandomFromRange(taskConfig.questionCount[0], taskConfig.questionCount[1])),
        questionInterval = Math.round(Config.Limits.defaultLength / questionCount),
        segments = Array<number>(),
        answersCount: number = isSimple ? taskConfig.simple.answersCount : taskConfig.complex.answersCount,
        builder = new FunctionBuilder();

    let complexFunction: Array<FunctionObj>,
        answers = Array<any>(),

        firstSegments: any,
        secondSegments: any;

    // Forbid an usage of axes A
    builder.setAllowedAxes(Config.Axes.set.copy().deleteItem("a"));

    // Cut the interval of function on few parts
    for (let i = 0; i < questionCount; i++)
        segments.push(questionInterval);
    complexFunction = builder.getComplexFunction(segments);

    let firstAnswers = Array<FunctionObj>(),
        secondAnswers = Array<FunctionObj>();

    if (!isSimple) {
        const half = answersCount / 2;
        firstSegments = Segments.getSegments(questionCount, half);
        firstAnswers = createAnswers(complexFunction, firstSegments, "S");

        secondSegments = Segments.getSegments(questionCount, half);
        secondAnswers = createAnswers(complexFunction, secondSegments, "Δ" + complexFunction[0].funcType);

        answers = firstAnswers.concat(secondAnswers);
    } else {
        firstSegments = Segments.getSegments(questionCount, answersCount);
        answers = createAnswers(complexFunction, firstSegments, "Δ" + complexFunction[0].funcType);
    }

    // Clear up the parameters of function (deleting unnecessary fields)
    const processedQuestion = Array<FunctionObj>();
    for (const func of complexFunction)
        processedQuestion.push(func.getProcessed());

    return {
        type: testType,
        test_id: test_id,
        title: "",
        question: [{graph: processedQuestion}],
        answers: answers.shuffle(),
    };
}

