"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("./Config");
Number.prototype.toFloor = function () {
    return Math.floor(this);
};
Number.prototype.toRound = function () {
    return Math.round(this);
};
// RETURN FLOORED VALUE [0..this)
Number.prototype.getRandom = function () {
    return Math.floor(Math.random() * this);
};
Number.prototype.getRandomF = function () {
    return Math.random() * this;
};
Array.prototype.getRandom = function () {
    return this[this.length.getRandom()];
};
Array.prototype.deleteItem = function (item) {
    if (this.indexOf(item) !== -1)
        this.splice(this.indexOf(item), 1);
    return this;
};
Array.prototype.contains = function (item) {
    return this.indexOf(item) !== -1;
};
Array.prototype.addRandom = function (array) {
    var index = this.length;
    do
        this[index] = array.getRandom();
    while (this.indexOf(this[index]) !== index);
};
Array.prototype.addRandomNumber = function (number) {
    var index = this.length;
    do
        this[index] = number.getRandom();
    while (this.indexOf(this[index]) !== index);
    return this[index];
};
Array.prototype.last = function () {
    return this[this.length - 1];
};
Array.prototype.copy = function () {
    return this.slice();
};
Array.prototype.shuffle = function () {
    return this.sort(function () { return Math.random() - 0.3; });
};
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getRandomFromBound = function (axis) {
        var value = Utils.getRandomFromRange(Config_1.Config.Bounds[axis][0], Config_1.Config.Bounds[axis][1]);
        if (Math.abs(value) <= 0.3)
            value = 0;
        return value * (Utils.withChance(0.5) ? 1 : -1);
    };
    Utils.getRandomOrZeroFromBound = function (axis) {
        if (this.withChance(0.2))
            return 0;
        else {
            var sign = Utils.withChance(0.5) ? 1 : -1, value = Utils.getRandomFromRange(Config_1.Config.Bounds[axis][0], Config_1.Config.Bounds[axis][1]);
            return sign * value;
        }
    };
    Utils.getRandomNonZeroFromBound = function (axis) {
        var value = Utils.getRandomFromRange(Config_1.Config.Bounds[axis][0], Config_1.Config.Bounds[axis][1]);
        if (Math.abs(value) <= Config_1.Config.Threshold[axis])
            value = 0;
        if (value === 0)
            return Utils.getRandomNonZeroFromBound(axis);
        return value;
    };
    Utils.getRandomWithSign = function (axis, _number) {
        return Math.abs(this.getRandomNonZeroFromBound(axis)) * Math.sign(_number);
    };
    Utils.getRandomFromRange = function (min, max) {
        return min + (max - min).getRandomF();
    };
    Utils.withChance = function (value) {
        return Math.random() <= value;
    };
    return Utils;
}());
exports.Utils = Utils;
exports.Segments = {
    // Return an array of segments
    getSegments: function (questionCount, answersCount) {
        var segments = Array();
        // Returns unique couple of indices (read - points) on coordinate plane
        for (var i = 0; i < answersCount; i++)
            segments.push(exports.Segments.createNextSegment(questionCount, segments));
        return segments;
    },
    // Creates new segment which differs from existing ones
    createNextSegment: function (questionCount, usedSegments, recursive_count) {
        if (!recursive_count)
            recursive_count = 1;
        else if (recursive_count === 30)
            throw new Error('To much recursive calls.');
        var leftSegment = exports.Segments.createBoundaryPoints(questionCount), rightSegment = exports.Segments.createBoundaryPoints(questionCount, [leftSegment]);
        var nextSegment = [leftSegment, rightSegment];
        // Sorts indices of the couple
        if (leftSegment[0] > rightSegment[0])
            nextSegment = [rightSegment, leftSegment];
        else if (leftSegment[0] === rightSegment[0])
            if (leftSegment[1] > rightSegment[1])
                nextSegment = [rightSegment, leftSegment];
        for (var _i = 0, usedSegments_1 = usedSegments; _i < usedSegments_1.length; _i++) {
            var usedSegment = usedSegments_1[_i];
            if (exports.Segments.segmentToString(nextSegment[0]) === exports.Segments.segmentToString(usedSegment[0]) &&
                exports.Segments.segmentToString(nextSegment[1]) === exports.Segments.segmentToString(usedSegment[1]))
                return exports.Segments.createNextSegment(questionCount, usedSegments, ++recursive_count);
        }
        return nextSegment;
    },
    // Create a boundary point for an interval (for example, [a,b] - a and b is boundary points)
    createBoundaryPoints: function (questionCount, usedSegments) {
        var leftPoint, rightPoint, nextSegment, iter_count = 0;
        // Creates two different boundary points
        rightPoint = questionCount.getRandom();
        for (iter_count = 0; iter_count < 30 && (leftPoint === rightPoint || leftPoint === undefined); ++iter_count)
            leftPoint = questionCount.getRandom();
        if (leftPoint === rightPoint || leftPoint === undefined)
            throw new Error('To many cycle iterations.');
        nextSegment = [leftPoint, rightPoint].sort();
        // Check if such segments already exists
        if (usedSegments)
            for (var _i = 0, usedSegments_2 = usedSegments; _i < usedSegments_2.length; _i++) {
                var segment = usedSegments_2[_i];
                if (segment[0] === nextSegment[0] && segment[1] === nextSegment[1])
                    return exports.Segments.createBoundaryPoints(questionCount, usedSegments);
            }
        return nextSegment;
    },
    // Converts a segment to a string
    segmentToString: function (segment) {
        return segment[0].toString() + segment[1].toString();
    },
};
