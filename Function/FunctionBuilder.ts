import { FunctionObj } from './FunctionObj'
import { Config } from "../Config";
import {Utils} from "../Util";

export class FunctionBuilder {
    private usedQuestionFuncs = Array<FunctionObj>();
    private usedCorrectFuncs = Array<FunctionObj>();
    private usedIncorrectFuncs = Array<FunctionObj>();

    private functionLength = Config.Limits.defaultLength;
    private allowedAxes = Config.getAxesCopy();
    private useAllowedAxes = false;
    private useSnap = false;
    private allowDuplicateText = true;
    private flipOnAxis = false;

    //------------------------------------
    // Builder properties
    //------------------------------------
    reset() {
        this.usedQuestionFuncs = Array<FunctionObj>();
        this.usedCorrectFuncs = Array<FunctionObj>();
        this.usedIncorrectFuncs = Array<FunctionObj>();

        this.functionLength = Config.Limits.defaultLength;
        this.allowedAxes = Config.getAxesCopy();
        this.useAllowedAxes = false;
        this.useSnap = false;
        this.allowDuplicateText = true;
        this.flipOnAxis = false;
    }

    setLength(length: number) {
        if (length < 0 || length > Config.Limits.defaultLength)
            throw Error('Parameter <functionLength> must be in [0,' + Config.Limits.defaultLength + '].');
        else if (length === 0)
            this.functionLength = Config.Limits.defaultLength;
        else
            this.functionLength = length;

        return this;
    }

    setAllowedAxes(axises: Array<string>) {
        if (axises.length <= 0) throw Error("Available axes array cant be empty!");

        this.allowedAxes = axises.copy();
        this.useAllowedAxes = true;
    }

    // Specify builder to use only axes listed in config file.
    disableAllowedAxes() {
        this.useAllowedAxes = false;
    }

    // Specify builder to use only listed in allowedAxes axes.
    enableAllowedAxes() {
        this.useAllowedAxes = true;
    }

    getAllowedAxes(): Array<string> {
        return this.allowedAxes.copy();
    }

    resetAllowedAxes() {
        this.allowedAxes = Config.getAxesCopy();
    }

    // Specify builder to duplicate check by sign.
    disableDuplicateText() {
        this.allowDuplicateText = false;
    }

    // Specify builder to duplicate check by text.
    enableDuplicateText() {
        this.allowDuplicateText = true;
    }

    // Specify builder to NOT snap end of function (maybe start too in future).
    disableSnap() {
        this.useSnap = false;
    }

    // Specify builder to snap end of function (maybe start too in future).
    enableSnap() {
        this.useSnap = true;
    }

    enableAxisFlip(){
        this.flipOnAxis = true;
    }

    disableAxisFlip(){
        this.flipOnAxis = false;
    }
    //------------------------------------
    // Methods that returns functions
    //------------------------------------

    // Actually this is simply a func with duplicate managment. not a 'question' func.
    getQuestionFunction(axes: Array<string> = []): FunctionObj {
        const savedAxes = this.getAllowedAxes();
        const savedState = this.useAllowedAxes;

        // trick to use specefied in arguments axes list
        if (axes.length > 0) {
            this.useAllowedAxes = true;
            this.allowedAxes = axes;
        }

        const questionObject = this.createQuestionFunction();
        this.usedQuestionFuncs.push(questionObject);

        // restore back
        this.allowedAxes = savedAxes;
        this.useAllowedAxes = savedState;
        return questionObject;
    }

    getCorrectFunction(questionObj: FunctionObj): FunctionObj {
        const correctFunction = this.createCorrectFunction(questionObj);
        this.usedCorrectFuncs.push(correctFunction);

        return correctFunction;
    }

    getIncorrectFunction(questionObj: FunctionObj): FunctionObj {
        const incorrectFunction = this.createIncorrectFunction(questionObj);
        this.usedIncorrectFuncs.push(incorrectFunction);

        return incorrectFunction;
    }

    getComplexFunction(functionsLengths: Array<number>): Array<FunctionObj> {
        return this.createComplexFunction(functionsLengths);
    }


    //------------------------------------
    // Methods that creates functions
    //------------------------------------
    private createQuestionFunction(recursive_count = 1): FunctionObj {
        if (recursive_count > 100) throw Error('Too many recursive calls');

        const questionFunc = new FunctionObj(this.allowedAxes.getRandom()).generateParams();

        for (const func of this.usedQuestionFuncs)
            if (questionFunc.comparisons.equalBySignTo(func))
                return this.createQuestionFunction(++recursive_count);

        questionFunc.params.len = this.functionLength;
        questionFunc.behaviour.snapBegin().snapEnd();

        if (questionFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createQuestionFunction(++recursive_count);

        return questionFunc;
    }

    private createCorrectFunction(questionObj: FunctionObj, recursive_count = 1): FunctionObj {
        if (recursive_count > 150) throw Error('Too many recursive calls');

        let correctFunc: FunctionObj,
            pickedAxis: string,
            newParams: any;

        if (this.useAllowedAxes)
            pickedAxis = this.getAllowedAxes().deleteItem(questionObj.funcType).getRandom();
        else {
            pickedAxis = Config.getAxesCopy([questionObj.funcType]).getRandom();
        }

        newParams = questionObj.copyParams();
        correctFunc = new FunctionObj(pickedAxis, newParams).makeCorrectParams().clearParams();
        correctFunc.params.len = this.functionLength;


        for (const usedCorrectFunc of this.usedCorrectFuncs)
            if (correctFunc.comparisons.equalBySignTo(usedCorrectFunc))
                return this.createCorrectFunction(questionObj, ++recursive_count);

        if(!this.allowDuplicateText)
            for (const usedCorrectFunc of this.usedCorrectFuncs)
                if (correctFunc.comparisons.equalByTextTo(usedCorrectFunc))
                     return this.createCorrectFunction(questionObj, ++recursive_count);


        // snapEnd affects function what should not be affected
        if (this.useSnap)
            correctFunc.behaviour.snapEnd();

        if (correctFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createCorrectFunction(questionObj, ++recursive_count);

        return correctFunc;
    }


    private createIncorrectFunction(questionObj: FunctionObj, recursive_count = 1): FunctionObj {
        if (recursive_count > 250) throw Error('Too many recursive calls');

        let incorrectFunc: FunctionObj,
            pickedAxis: string,
            params = questionObj.copyParams();
        if (this.useAllowedAxes)
            pickedAxis = this.getAllowedAxes().deleteItem(questionObj.funcType).getRandom();
        else
            pickedAxis = Config.getAxesCopy([questionObj.funcType]).getRandom();

        incorrectFunc = new FunctionObj(pickedAxis, params).clearParams().makeIncorrectParams().clearParams();
        incorrectFunc.params.len = this.functionLength;

        for (const func of this.usedIncorrectFuncs)
            if (incorrectFunc.comparisons.equalBySignTo(func))
                return this.createIncorrectFunction(questionObj, ++recursive_count);

        // snapEnd affects function what should not be affected
        if (this.useSnap)
            incorrectFunc.behaviour.snapEnd();

        if (incorrectFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createIncorrectFunction(questionObj, ++recursive_count);
        return incorrectFunc;
    }

    private createComplexFunction(funcsLengths: Array<number>) {
        const defaultLength = Config.Limits.defaultLength,
            savedLength = this.functionLength,
            complexFunc = Array<FunctionObj>();
        let cumLength = 0;

        for (const length of funcsLengths)
            cumLength += length;
        if (cumLength > defaultLength)
            throw Error('The sum of functions lengths values greater than ' + defaultLength);

        this.setLength(funcsLengths[0]);
        complexFunc.push(this.getQuestionFunction()); // Start of complex function is questionFunc, so we don`t need to care about duplicates
        for (let i = 1; i < funcsLengths.length; ++i) {
            if(this.flipOnAxis && Utils.withChance(0.5)){
                complexFunc.push(FunctionBuilder.connectingLine(complexFunc.last(), Config.Tasks.secondRS.offset));
                funcsLengths[i] -= Config.Tasks.secondRS.offset;
            }
            complexFunc.push(this.createNextFunction(complexFunc.last(), funcsLengths[i]));
        }

        this.setLength(savedLength);
        return complexFunc;
    }

    private static connectingLine(prevFunc: FunctionObj, lineLen: number){
        const startY = prevFunc.values.calcFinalValue(),
            endY = -startY,
            line = new FunctionObj("v");
        line.params.v = startY;
        line.params.a = (endY - startY) / lineLen;
        line.params.len = lineLen;
        line.params._connectingLine = true;
        return line;
    }

    private createNextFunction(prevFunc: FunctionObj,
                               nextFuncLen = this.functionLength,  recursive_count: number = 1): FunctionObj {
        if (recursive_count > 30) throw new Error('Too many recursive calls');
        if (!prevFunc.params.len) throw new Error("this.params.len is undefined");


        const funcType = prevFunc.funcType,
            nextFunc = new FunctionObj(funcType).generateParams();
        let prevFuncValue: number;
        nextFunc.params.len = nextFuncLen;


        prevFuncValue = prevFunc.values.calcFinalValue();
        nextFunc.params[funcType] = prevFuncValue;
        nextFunc.behaviour.snapEnd();


        if (nextFunc.comparisons.equalByDirectionTo(prevFunc))
            return this.createNextFunction(prevFunc, nextFuncLen, ++recursive_count);

        return nextFunc;
    }

}
