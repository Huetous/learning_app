import {FunctionObj} from "./FunctionObj";
import {Config} from "../Config";


export class FunctionComparison {
    private _functionObj: FunctionObj;
    
    
    constructor(functionObject: FunctionObj ) {
        this._functionObj = functionObject;
    }

    // xva == va
    equalByTextTo(obj: FunctionObj): boolean {
        return this._functionObj.getTextDescription() === obj.getTextDescription()
    }

    equalBySignTo(obj: FunctionObj): boolean {
        const funcObj = this._functionObj;

        if (funcObj === undefined || obj === undefined) return false;

        if (funcObj.funcType === obj.funcType) {
            if (funcObj.params.x !== undefined && obj.params.x !== undefined) {
                if ((Math.sign(funcObj.params.x) === Math.sign(obj.params.x)) &&
                    (Math.sign(funcObj.params.v) === Math.sign(obj.params.v)) &&
                    (Math.sign(funcObj.params.a) === Math.sign(obj.params.a)))
                    return true;
            }
            else if (funcObj.params.v !== undefined && obj.params.v !== undefined) {
                if ((Math.sign(funcObj.params.v) === Math.sign(obj.params.v)) &&
                    (Math.sign(funcObj.params.a) === Math.sign(obj.params.a))) {
                    return true;
                }
            }
            else if (funcObj.params.a !== undefined && obj.params.a !== undefined) {
                if ((Math.sign(funcObj.params.a) === Math.sign(obj.params.a)))
                    return true;
            }
        }
        return false;
    }

    equalByValueTo(obj: FunctionObj): boolean {
        if (obj === undefined) return false;
        const funcObj = this._functionObj;

        if (funcObj.funcType === obj.funcType)
            if (funcObj.params.x === obj.params.x &&
                funcObj.params.v === obj.params.v &&
                funcObj.params.a === obj.params.a)
                return true;

        return false;
    }

    equalByDirectionTo(obj: FunctionObj): boolean {
        // Functions have equal directions when their derivatives have equal sign
        const   funcObj = this._functionObj;
        let     this_dir: number,
                nextFunc_dir: number;

        switch (obj.funcType) {
            case "x":
                this_dir = funcObj.params.v + funcObj.params.a * funcObj.params.len;
                nextFunc_dir = obj.params.v + obj.params.a * obj.params.len;
                return Math.sign(this_dir) === Math.sign(nextFunc_dir);
            case "v":
                this_dir = funcObj.params.a;
                nextFunc_dir = obj.params.a;
                return Math.sign(this_dir) === Math.sign(nextFunc_dir);
        }

        return false;
    }
}