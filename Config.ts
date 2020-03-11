import {Utils} from "./Util";

export const Config = {

    Axes: {
        set: [
            'x', 'v', 'a'
        ],

        X: "x",
        V: "v",
        A: "a",
    },

    Bounds: {
        x: [0.1, 4],
        v: [0.1, 1],
        a: [0.15, 0.5],
    } as any,

    // zero snap threshold in random function
    Threshold: { 
        x: 0.4,
        v: 0.1,
        a: 0.05
    } as any,

    Limits: {
        upperLimit: 5,      // max function value
        lowerLimit: 2,      // min function value (near of zero) doesnt used mostly, use snap
        minimumLength: 2,
        defaultLength: 12,
    },

    Tasks: {
        G2G: {
            questionCount: 1,
            answersCount: 6
        },
        S2G: {
            questionCount: 4,
            answersCount: 4
        },
        RS: {
            questionCount: [3, 4],
            simple: {
                answersCount: 3
            },
            complex: {
                answersCount: 4
            }
        },
        secondRS: {
            questionCount: [5, 7],
            answersCount: 1,
            offset: 0.1,
        }
    },

    TextDescription: {
        directions: {
            'вперед': 1,
            'назад': -1,
            'без начальной скорости': 0,
        },
        how: {
            "равномерно ": 0,
            "ускоряясь вперед": 1,
            "ускоряясь назад": -1,
        },
        position: {
            'выше нуля': 1,
            'ниже нуля': -1,
            'в нуле': 0,
        },
        movement: {
            "покоится": 0,
            "движется": 1,
        }
    },


    getAxesCopy(this:any, except: string[] = []): string[] {
        const copy = this.Axes.set.copy();
        for (const item of except) {
            copy.deleteItem(item);
        }

        return copy;
    }
};

