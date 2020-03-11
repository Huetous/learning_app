import { FunctionObj } from './FunctionObj'
import { Config } from "../Config";
import {Utils} from "../Util";


/**
 * Class FunctionBuilder
 *
 * fields:
 *      usedQuestionFuncs - an array which contains of existing question functions
 *      usedCorrectFuncs - an array which contains of existing correct functions
 *      usedIncorrectFuncs - an array which contains of existing incorrect functions
 *
 *      functionLength -
 * */
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

    // Resets all class fields to their default values
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

    // Sets a new value of function length
    setLength(length: number) {
        if (length < 0 || length > Config.Limits.defaultLength)
            throw Error('Parameter <functionLength> must be in [0,' + Config.Limits.defaultLength + '].');
        else if (length === 0)
            this.functionLength = Config.Limits.defaultLength;
        else
            this.functionLength = length;

        return this;
    }

    // Sets a set of allowed axes
    setAllowedAxes(axises: Array<string>) {
        if (axises.length <= 0) throw Error("Available axes array cant be empty!");

        this.allowedAxes = axises.copy();
        this.useAllowedAxes = true;
    }

    // Specifies builder to use only those axes that are listed in config file
    disableAllowedAxes() {
        this.useAllowedAxes = false;
    }

    // Specifies builder to use only those axes that are listed in allowedAxes
    enableAllowedAxes() {
        this.useAllowedAxes = true;
    }

    // Return a copy of a set of allowedAxes
    getAllowedAxes(): Array<string> {
        return this.allowedAxes.copy();
    }

    // Resets field allowedAxes to its default value
    resetAllowedAxes() {
        this.allowedAxes = Config.getAxesCopy();
    }

    // Disallows builder to create functions which have identical text description
    disableDuplicateText() {
        this.allowDuplicateText = false;
    }

    // Allows builder to create functions which have identical text description
    enableDuplicateText() {
        this.allowDuplicateText = true;
    }

    // Disallows builder to snap an end and a start of function to a grid note
    disableSnap() {
        this.useSnap = false;
    }

    // Allows builder to snap an end and a start of function to a grid note
    enableSnap() {
        this.useSnap = true;
    }

    // Allows builder to flip function about coordinate axis
    enableAxisFlip(){
        this.flipOnAxis = true;
    }

    // Disallows builder to flip function about coordinate axis
    disableAxisFlip(){
        this.flipOnAxis = false;
    }


    //------------------------------------
    // Methods that returns functions
    //------------------------------------

    // Return a new function object
    getQuestionFunction(): FunctionObj {
        const questionObject = this.createQuestionFunction();
        this.usedQuestionFuncs.push(questionObject);

        return questionObject;
    }

    // Return a new correct function
    getCorrectFunction(questionObj: FunctionObj): FunctionObj {
        const correctFunction = this.createCorrectFunction(questionObj);
        this.usedCorrectFuncs.push(correctFunction);

        return correctFunction;
    }

    // Return a new incorrect function
    getIncorrectFunction(questionObj: FunctionObj): FunctionObj {
        const incorrectFunction = this.createIncorrectFunction(questionObj);
        this.usedIncorrectFuncs.push(incorrectFunction);

        return incorrectFunction;
    }

    // Return a new complex function
    getComplexFunction(functionsLengths: Array<number>): Array<FunctionObj> {
        return this.createComplexFunction(functionsLengths);
    }


    //------------------------------------
    // Methods that creates functions
    //------------------------------------

    // Creates a new question function
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

    // Creates a new correct function
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


        // Check if new incorrect function is equal to some of already existing by sign
        for (const usedCorrectFunc of this.usedCorrectFuncs)
            if (correctFunc.comparisons.equalBySignTo(usedCorrectFunc))
                return this.createCorrectFunction(questionObj, ++recursive_count);

        // Check if new incorrect function is equal to some of already existing by text
        if(!this.allowDuplicateText)
            for (const usedCorrectFunc of this.usedCorrectFuncs)
                if (correctFunc.comparisons.equalByTextTo(usedCorrectFunc))
                     return this.createCorrectFunction(questionObj, ++recursive_count);

        // Snaps function end to a grid node
        if (this.useSnap)
            correctFunc.behaviour.snapEnd();

        if (correctFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createCorrectFunction(questionObj, ++recursive_count);

        return correctFunc;
    }

    // Creates a new incorrect function
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

        // Check if new incorrect function is equal to some of already existing by sign
        for (const func of this.usedIncorrectFuncs)
            if (incorrectFunc.comparisons.equalBySignTo(func))
                return this.createIncorrectFunction(questionObj, ++recursive_count);

        // Snaps function end to a grid node
        if (this.useSnap)
            incorrectFunc.behaviour.snapEnd();

        if (incorrectFunc.behaviour.isConvex() && recursive_count < 30)
            return this.createIncorrectFunction(questionObj, ++recursive_count);
        return incorrectFunc;
    }

    // Creates a new compelx function
    private createComplexFunction(funcsLengths: Array<number>) {
        const defaultLength = Config.Limits.defaultLength,
            savedLength = this.functionLength,
            complexFunc = Array<FunctionObj>();
        let cumLength = 0;

        // Check if sum of function length are equal to default length listed in config
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

    // Connects the gap between two points of a function
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

    // Creates a next part of function for a given one
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
