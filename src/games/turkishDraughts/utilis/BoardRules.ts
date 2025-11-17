function calculateLeftAndRight(gorgeId: number, result: number[], step: number) {
    if (gorgeId % 8 != 0) {
        result.push(gorgeId - step);
    }

    if (gorgeId % 8 != 7) {
        result.push(gorgeId + step);
    }
}

export function nextGorgesPlayerOne(gorgeId: number, step: number, isCaptured: boolean = false) {
    let result: number[] = [];


    result.push(gorgeId - 8 * step);
    calculateLeftAndRight(gorgeId, result, step);

    if (isCaptured) {
        result.push(gorgeId + 8 * step)
    }


    return result;
}

export function nextGorgesPlayerTwo(gorgeId: number, step: number, isCaptured: boolean = false) {
    let result: number[] = [];

    result.push(gorgeId + 8 * step);
    calculateLeftAndRight(gorgeId, result, step);

    if (isCaptured) {
        result.push(gorgeId - 8 * step);
    }

    return result;
}