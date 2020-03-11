import {Config} from "./Config";

declare global {
    interface Number {
        toFloor(): number;

        toRound(): number;

        getRandom(): number;

        getRandomF(): number;
    }

    interface Array<T> {
        getRandom(): T;

        deleteItem(item: T): Array<T>;

        contains(item: T): boolean;

        addRandom(array: Array<T>): any;

        addRandomNumber(number: number): any;

        last(): T;

        copy(): Array<T>;

        shuffle(): Array<T>;
    }
}
Number.prototype.toFloor = function (this: number): number {
    return Math.floor(this);
};
Number.prototype.toRound = function(this: number): number {
  return Math.round(this);
};
// RETURN FLOORED VALUE [0..this)
Number.prototype.getRandom = function (this: number): number {
    return Math.floor(Math.random() * this);
};
Number.prototype.getRandomF = function (this: number): number {
    return Math.random() * this;
};
Array.prototype.getRandom = function <T>(this: T[]): T {
    return this[this.length.getRandom()];
};
Array.prototype.deleteItem = function <T>(this: T[], item: T): Array<T> {
    if (this.indexOf(item) !== -1)
        this.splice(this.indexOf(item), 1);
    return this;
};
Array.prototype.contains = function <T>(this: T[], item: T): any {
    return this.indexOf(item) !== -1
};
Array.prototype.addRandom = function <T>(this: T[], array: Array<T>) {
    const index = this.length;

    do this[index] = array.getRandom();
    while (this.indexOf(this[index]) !== index);
};
Array.prototype.addRandomNumber = function <T>(this: number[], number: number) {
    const index = this.length;
    do this[index] = number.getRandom();
    while (this.indexOf(this[index]) !== index);

    return this[index];
};
Array.prototype.last = function <T>(this: T[]): T {
    return this[this.length - 1];
};
Array.prototype.copy = function <T>(this: T[]): Array<T> {
    return this.slice();
};

Array.prototype.shuffle = function <T>(this: T[]): Array<T> {
    return this.sort(() => Math.random() - 0.3);
};

export class Utils {
    static getRandomFromBound(axis: string) {
        let value = Utils.getRandomFromRange(Config.Bounds[axis][0], Config.Bounds[axis][1]);
        if (Math.abs(value) <= 0.3)
            value = 0;
        return value * (Utils.withChance(0.5) ? 1 : -1);
    }

    static getRandomOrZeroFromBound(axis: string) {
        if (this.withChance(0.2))
            return 0;
        else {
            const sign = Utils.withChance(0.5) ? 1 : -1,
                value = Utils.getRandomFromRange(Config.Bounds[axis][0], Config.Bounds[axis][1]);
            return sign * value;
        }
    }

    static getRandomNonZeroFromBound(axis: string): number {
        let value = Utils.getRandomFromRange(Config.Bounds[axis][0], Config.Bounds[axis][1]);

        if (Math.abs(value) <= Config.Threshold[axis])
            value = 0;

        if (value === 0)
            return Utils.getRandomNonZeroFromBound(axis);
        return value
    }

    static getRandomWithSign(axis: string, _number: number): number {
        return Math.abs(this.getRandomNonZeroFromBound(axis)) * Math.sign(_number)
    }

    static getRandomFromRange(min: number, max: number) {
        return min + (max - min).getRandomF();
    }

    static withChance(value: number) {
        return Math.random() <= value;
    }


}

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