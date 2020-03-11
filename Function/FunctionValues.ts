import {FunctionObj} from "./FunctionObj";

export class FunctionValues {
    private _functionObj: FunctionObj;

    constructor(functionObject: FunctionObj ) {
        this._functionObj = functionObject;
    }

    // Returns final values of function (function values at end of its length)
    calcFinalValue(len?: number): number {
        const   funcObj = this._functionObj,
                params = funcObj.params,
                t = len !== undefined ? len : params.len;
        let     value: number;

        switch (funcObj.funcType) {
            case "x":
                value = params.x + params.v * t + (params.a * t * t) / 2;
                return Math.round(value * 100) / 100;
            case "v":
                value = params.v + params.a * t;
                return Math.round(value * 100) / 100;
            case "a":
                value = params.a;
                return Math.round(value * 100) / 100;
        }
        throw Error('Incorrect type of function.');
    }

    // Returns the area under function curve
    calcIntegral(): number {
        const   funcObj = this._functionObj,
                params = funcObj.params,
                X = params.x,
                V = params.v,
                A = params.a,
                L = params.len;

        switch (funcObj.funcType) {
            case "x":
                return X * L + (V * L * L) / 2 + (A * L * L * L) / 6;
            case "v":
                return V * L + (A * L * L) / 2;
        }
        return 0;
    }

    // Returns the area under function curve on segment
    static calcIntegralOnSegment(start: number, end: number, functions: Array<FunctionObj>): number {
        let result = 0;

        for (let i = start; i < end + 1; i++)
            result += functions[i].values.calcIntegral();

        return result;
    }
}