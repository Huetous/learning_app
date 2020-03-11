"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var secondRS_1 = require("./Tasks/UnitSecond/secondRS");
var UnitSecond = /** @class */ (function () {
    function UnitSecond() {
    }
    UnitSecond.getSecondRStest = function (test_id) {
        return secondRS_1.getSecondRStest(test_id);
    };
    return UnitSecond;
}());
exports.UnitSecond = UnitSecond;
