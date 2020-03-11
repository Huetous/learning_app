import {FunctionObj} from "./FunctionObj";
import {Config} from "../Config";


// Provides methods to control function behaviour at start, at end and in middle of a segment
export class FunctionBehaviour {

    private _functionObj: FunctionObj;

    constructor(functionObject: FunctionObj) {
        this._functionObj = functionObject;
    }

    // Changes the parameters of the this functionObj such as it ENDS at the grid note
    snapEnd(): FunctionBehaviour {
        const funcObj = this._functionObj,
            funcType = funcObj.funcType,
            params = funcObj.params,
            len = funcObj.params.len,
            X = params.x,
            V = params.v,
            A = params.a,
            value = funcObj.values.calcFinalValue();
        let result = 0;

        // Ending point of function must not be going higher than upper limit
        if (value !== 0)
            result = Math.round(Math.min(Math.abs(value), Config.Limits.upperLimit)) * Math.sign(value);

        // Calculates new parameters of function which satisfies an ending point
        switch (funcType) {
            case "x":
                if (V !== 0 && A !== 0) {
                    const new_V = (result - X - (A * len * len) / 2) / len,
                        new_A = 2 * (result - X - V * len) / (len * len),
                        sign_A = Math.sign(A),
                        sign_V = Math.sign(V);

                    if (sign_A === Math.sign(new_A) && sign_V === Math.sign(new_V)) {
                        if (sign_V === 0)
                            params.a = new_A;
                        else
                            params.v = new_V;
                    }
                    else if (sign_A === -Math.sign(new_A))
                        params.v = new_V;
                    else if (sign_V === -Math.sign(new_V))
                        params.a = new_A;
                    else throw Error("Case 'x'. Incorrect composition of params.")
                }
                else if (V !== 0) params.v = (result - X - (A * len * len) / 2) / len;
                else if (A !== 0) params.a = 2 * (result - X - V * len) / (len * len);
                break;
            case "v":
                if (A !== 0)
                    params.a = (result - V) / len;
                break;
        }

        return this;
    }

    // Changes the parameters of the this functionObj such as it STARTS at the grid note
    snapBegin(): FunctionBehaviour {
        const funcObj = this._functionObj,
            funcType = funcObj.funcType,
            params = funcObj.params;

        if (funcType === 'x' || funcType === 'v')
            params[funcType] = Math.round(params[funcType]);

        return this;
    }

    // Returns true if function reaches limits inside of segment
    isConvex(start: number = 0, end: number = this._functionObj.params.len): boolean {
        const funcObj = this._functionObj,
            params = funcObj.params,
            upperLimit = Config.Limits.upperLimit;
        let S: number,
            E: number,
            C: number,
            MaxValue: number;

        // Function value at a start (S) and at an end (E) of segment
        S = funcObj.values.calcFinalValue(start);
        E = funcObj.values.calcFinalValue(end);

        switch (funcObj.funcType) {
            case 'x':
                if (params.a === 0)
                    return Math.abs(S) > upperLimit || Math.abs(E) > upperLimit;
                else {
                    C = -params.v / params.a;
                    MaxValue = funcObj.values.calcFinalValue(C);
                    return Math.abs(S) > upperLimit ||
                        Math.abs(E) > upperLimit ||
                        Math.abs(MaxValue) > upperLimit;
                }
            case 'v':
                return Math.abs(S) > upperLimit || Math.abs(E) > upperLimit;
        }

        return false;
    }
}
