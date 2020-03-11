import {Utils} from '../Util';
import {Config} from "../Config";
import {FunctionComparison} from "./FunctionComparisons";
import {FunctionValues} from "./FunctionValues";
import {FunctionBehaviour} from "./FunctionBehaviour";

export class FunctionObj {
    params: any;
    funcType: string;

    behaviour: FunctionBehaviour;
    comparisons: FunctionComparison;
    values: FunctionValues;

    constructor(_funcType: string, _params: any = {}) {
        this.behaviour = new FunctionBehaviour(this);
        this.comparisons = new FunctionComparison(this);
        this.values = new FunctionValues(this);
        this.funcType = _funcType;
        this.params = _params;
    }


    //-------------------------------------------
    // Operations with function parameters
    //-------------------------------------------
    clearParams() {
        // Takes type of function and deletes unnecessary params for that type
        switch (this.funcType) {
            case "x":
                break;
            case "v":
                delete this.params.x;
                break;
            case "a":
                delete this.params.x;
                delete this.params.v;
                break;
        }
        return this;
    }

    makeFreeVariables(): FunctionObj {
        const   paramsKeys = Object.keys(this.params),
                params = this.params,
                Axes = Config.Axes;

        // Imputes necessary parameters for that type of function
        if (this.funcType === "x") {
            if (!paramsKeys.contains("x"))
                params.x = Utils.getRandomOrZeroFromBound(Axes.X);
            if (!paramsKeys.contains("v"))
                params.v = Utils.getRandomOrZeroFromBound(Axes.V);
        }
        if (this.funcType === "v")
            if (!paramsKeys.contains("v"))
                params.v = Utils.getRandomOrZeroFromBound(Axes.V);

        return this;
    }

    generateParams(): FunctionObj {
        let x, v, a = 0;
        const Axes = Config.Axes;

        x = Utils.getRandomOrZeroFromBound(Axes.X);
        v = Utils.getRandomOrZeroFromBound(Axes.V);
        if (Utils.withChance(0.7))
            a = Utils.getRandomOrZeroFromBound(Axes.A);

        if (x === 0 && v === 0 && a === 0)
            return this.generateParams();

        if (Math.sign(v) === Math.sign(a)) {
            if (Utils.withChance(0.5)) {
                if (v !== 0) v = -v;
            }
            else if (a !== 0) a = -a;
        }

        this.params = {"x": x, "v": v, "a": a};
        return this.clearParams();
    }

    copyParams(): any {
        return Object.assign({}, this.params);
    }

    makeCorrectParams(): FunctionObj {
        return this.makeFreeVariables();
    }

    // Invert from 1 to all params of function
    makeIncorrectParams(): FunctionObj {
        const   params = this.params,
                paramsKeys = Object.keys(params).deleteItem("len").shuffle();
        let     changes = (paramsKeys.length + 1).getRandom(); // get number of changes
        for (const key of paramsKeys) {
            switch (Math.sign(params[key])) {
                case 1:
                case -1:
                    params[key] = Utils.withChance(0.5) ? -params[key] : 0;
                    break;
                case 0:
                    params[key] = Utils.withChance(0.5) ? 1 : -1;
                    break;
            }
            params[key] = Utils.getRandomWithSign(key, params[key]);
            if(--changes < 0)
                break;
        }
        return this.makeFreeVariables();
    }

    //-------------------------------------------
    // Text description of function behaviour
    //-------------------------------------------
    getKeyByValue(object: any, value: any): string {
        // Returns text by value or sign
        const _key = Object.keys(object).find(key => object[key] === value);
        if (_key) return _key;
        else throw Error("Key is not found!");
    }

    // Returns description of function behaviour by its parameters
    // withUpperCase - is string should start with uppercase letter
    getTextDescription(withUpperCase: boolean = false): string {
        const params = this.params,
            textOf = Config.TextDescription,
            X = params.x,
            V = params.v,
            A = params.a,
            getText = (s: object, v: number) => this.getKeyByValue(s, v);
        let text = "";

        if (X !== undefined && V !== undefined && A !== undefined) {
            if (X === 0 && V === 0 && A === 0) {
                text += getText(textOf.movement, 0);
                text += ' ' + getText(textOf.position, 0);
            }
            else if (X !== 0 && V === 0 && A === 0) {
                text += getText(textOf.movement, 0);
                text += ' ' + getText(textOf.position, Math.sign(X));
            }
            else {
                //IDENTICAL BLOCK #1
                if (V !== 0)
                    if (A !== 0) {
                        text += getText(textOf.movement, 1);
                        text += ' ' + getText(textOf.directions, Math.sign(V));
                        text += ', ' + getText(textOf.how, Math.sign(A));
                    }
                    else {
                        text += getText(textOf.movement, 1);
                        text += ' ' + getText(textOf.how, 0);
                    }
                else if (A !== 0) {
                    text += getText(textOf.movement, 1);
                    text += ' ' + getText(textOf.directions, 0);
                    text += ' ' + getText(textOf.how, Math.sign(A));
                }
                else {
                    text += getText(textOf.movement, 0);
                    text += ' ' + getText(textOf.position, 0);
                }
            }
        }
        else if (V !== undefined && A !== undefined) {
            //IDENTICAL BLOCK #2
            if (V !== 0)
                if (A !== 0) {
                    text += getText(textOf.movement, 1);
                    text += ' ' + getText(textOf.directions, Math.sign(V));
                    text += ', ' + getText(textOf.how, Math.sign(A));
                }
                else {
                    text += getText(textOf.movement, 1);
                    text += ' ' + getText(textOf.how, 0);
                }
            else if (A !== 0) {
                text += getText(textOf.movement, 1);
                text += ' ' + getText(textOf.directions, 0);
                text += ' ' + getText(textOf.how, Math.sign(A));
            }
            else text += getText(textOf.movement, 0);
        }
        else if (A !== undefined) {
            text += getText(textOf.movement, 1);
            text += ' ' + getText(textOf.how, Math.sign(A));
        }
        else throw new Error('Incorrect function type.');

        if (withUpperCase) {
            if (text[0] === ' ') text = text.substr(1);
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    }

    // Return the function without unnecessary fields
    getProcessed(){
        let processedFunc = new FunctionObj(this.funcType, this.params);
        delete processedFunc.behaviour;
        delete processedFunc.values;
        delete processedFunc.comparisons;
        return processedFunc;
    }
}