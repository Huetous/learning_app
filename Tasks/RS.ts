import {FunctionObj} from "../Function/FunctionObj";
import {Config} from "../Config";
import {FunctionBuilder} from "../Function/FunctionBuilder";
import {Utils} from "../Util";
import {FunctionValues} from "../Function/FunctionValues";


export let Segments = {
    // Return an array of segments
    getSegments(questionCount: number, answersCount: number): Array<Array<Array<number>>> {
        const segments = Array<Array<Array<number>>>();

        // Returns unique couple of indices (read - points) on coordinate plane
        for (let i = 0; i < answersCount; i++)
            segments.push(Segments.createNextSegment(questionCount, segments));

        return segments;
    },

    // Creates new segment which differs from existing ones
    createNextSegment(questionCount: number, usedSegments: Array<Array<Array<number>>>, recursive_count?: number): Array<Array<number>> {
        if (!recursive_count) recursive_count = 1;
        else if (recursive_count === 30) throw new Error('To much recursive calls.');

        const leftSegment = Segments.createBoundaryPoints(questionCount),
            rightSegment = Segments.createBoundaryPoints(questionCount, [leftSegment]);
        let nextSegment = [leftSegment, rightSegment];


        // Sorts indices of the couple
        if (leftSegment[0] > rightSegment[0])
            nextSegment = [rightSegment, leftSegment];
        else if (leftSegment[0] === rightSegment[0])
            if (leftSegment[1] > rightSegment[1])
                nextSegment = [rightSegment, leftSegment];

        for (const usedSegment of usedSegments)
            if (Segments.segmentToString(nextSegment[0]) === Segments.segmentToString(usedSegment[0]) &&
                Segments.segmentToString(nextSegment[1]) === Segments.segmentToString(usedSegment[1]))
                return Segments.createNextSegment(questionCount, usedSegments, ++recursive_count);

        return nextSegment;
    },

    // Create a boundary point for an interval (for example, [a,b] - a and b is boundary points)
    createBoundaryPoints(questionCount: number, usedSegments?: Array<Array<number>>): Array<number> {
        let leftPoint,
            rightPoint,
            nextSegment: Array<number>,
            iter_count = 0;


        // Creates two different boundary points
        rightPoint = questionCount.getRandom();
        for (iter_count = 0; iter_count < 30 && (leftPoint === rightPoint || leftPoint === undefined); ++iter_count)
            leftPoint = questionCount.getRandom();

        if (leftPoint === rightPoint || leftPoint === undefined) throw new Error('To many cycle iterations.');

        nextSegment = [leftPoint, rightPoint].sort();

        // Check if such segments already exists
        if (usedSegments)
            for (const segment of usedSegments)
                if (segment[0] === nextSegment[0] && segment[1] === nextSegment[1])
                    return Segments.createBoundaryPoints(questionCount, usedSegments);

        return nextSegment;
    },

    // Converts a segment to a string
    segmentToString(segment: Array<number>): String {
        return segment[0].toString() + segment[1].toString();
    },
};

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

///
/// If test is simple, answers is deltas, in other way, answers is half area and hafl path length
///
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


//
// export function getRStest(test_id: number, isSimple: boolean) {
//     const testType = "relationSings",
//         answers = Array<any>(),
//         taskConfig = Config.Tasks.RS,
//         questionCount = Math.round(Utils.getRandomFromRange(taskConfig.questionCount[0], taskConfig.questionCount[1])),
//         questionInterval = Math.round(Config.Limits.defaultLength / questionCount),
//         functionsLengths = Array<number>(),
//         answersCount: number = isSimple ? taskConfig.simple.answersCount : taskConfig.complex.answersCount,
//         builder = new FunctionBuilder();
//
//     let complexFunction: Array<FunctionObj>,
//
//         firstIndexes: any,
//         secondIndexes: any,
//         indexes: any,
//         letter = "S",
//
//         leftValue: number,
//         rightValue: number,
//         leftCouple: any,
//         rightCouple: any,
//         rightFunction: FunctionObj,
//         leftFunction: FunctionObj,
//         countS = 0,
//         countDX = 0,
//         globalCount = 0;
//
//
//     builder.setAllowedAxes(Config.Axes.set.copy().deleteItem("a"));
//     for (let i = 0; i < questionCount; i++)
//         functionsLengths.push(questionInterval);
//     complexFunction = builder.getComplexFunction(functionsLengths);
//
//     if (!isSimple) {
//         firstIndexes = Segments.getSegments(questionCount, answersCount / 2);
//         secondIndexes = Segments.getSegments(questionCount, answersCount / 2);
//     } else
//         firstIndexes = Segments.getSegments(questionCount, answersCount);
//
//
//
//     // leftCouple := [a,b], where a,b - numbers
//     // rightCouple := [c,d], where c,d - numbers
//     for (let i = 0; i < answersCount; ++i) {
//         if (!isSimple) {
//             letter = countS < (answersCount / 2) ? "S" : "Δ" + complexFunction[0].funcType;
//             if (letter === "S") {
//                 indexes = firstIndexes;
//                 globalCount = countS;
//             } else {
//                 indexes = secondIndexes;
//                 globalCount = countDX;
//             }
//         } else
//             indexes = firstIndexes;
//
//         leftCouple = {
//             left: indexes[globalCount][0][0],
//             right: indexes[globalCount][0][1],
//         };
//         rightCouple = {
//             left: indexes[globalCount][1][0],
//             right: indexes[globalCount][1][1],
//         };
//
//         if (!isSimple && letter !== null && letter === "S") {
//             leftValue = complexFunction[0].values.calcIntegralOnSegment(leftCouple.left, leftCouple.right, complexFunction);
//             rightValue = complexFunction[0].values.calcIntegralOnSegment(rightCouple.left, rightCouple.right, complexFunction);
//         } else {
//             leftFunction = complexFunction[leftCouple.right];
//             rightFunction = complexFunction[rightCouple.right];
//
//             leftValue = leftFunction.values.calcIntegral();
//             rightValue = rightFunction.values.calcIntegral();
//         }
//
//         // if (!isSimple && letter !== null) {
//         //     if (letter === "S") {
//         //         leftValue = complexFunction[0].values.calcIntegralOnSegment(leftCouple.left, leftCouple.right, complexFunction);
//         //         rightValue = complexFunction[0].values.calcIntegralOnSegment(rightCouple.left, rightCouple.right, complexFunction);
//         //     } else {
//         //         leftFunction = complexFunction[leftCouple.right];
//         //         rightFunction = complexFunction[rightCouple.right];
//         //
//         //         leftValue = leftFunction.values.calcFinalValue();
//         //         rightValue = rightFunction.values.calcFinalValue();
//         //     }
//         // } else {
//         //     leftFunction = complexFunction[leftCouple.right];
//         //     rightFunction = complexFunction[rightCouple.right];
//         //
//         //     leftValue = leftFunction.values.calcFinalValue();
//         //     rightValue = rightFunction.values.calcFinalValue();
//         // }
//
//         answers[i] = {
//             id: i,
//             letter: isSimple ? complexFunction[0].funcType : letter,
//             leftIndexes: [parseInt(indexes[globalCount][0][0]), (parseInt(indexes[globalCount][0][1]) + 1)],
//             rightIndexes: [parseInt(indexes[globalCount][1][0]), (parseInt(indexes[globalCount][1][1]) + 1)],
//             correctSign: Math.sign(leftValue - rightValue),
//         };
//
//         if (!isSimple)
//             if (letter === "S") countS++;
//             else countDX++;
//         else globalCount++;
//     }
//
//     const processedQuestion = Array<FunctionObj>();
//     for (const func of complexFunction)
//         processedQuestion.push(func.getProcessed());
//
//     return {
//         type: testType,
//         test_id: test_id,
//         title: "",
//         question: [{graph: processedQuestion}],
//         answers: answers.shuffle(),
//     };
// }
//
//

