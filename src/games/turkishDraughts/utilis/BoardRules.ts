const MAX_GORGES_PER_ROW = 8;
const MIN_GORGE_NUMBER = 0;
const MAX_GORGE_NUMBER = 63

function calculateLeftAndRight(gorgeId: number, result: number[], step: number) {
    if (gorgeId % MAX_GORGES_PER_ROW != MIN_GORGE_NUMBER) {
        result.push(gorgeId - step);
    }

    if (gorgeId % MAX_GORGES_PER_ROW != MAX_GORGES_PER_ROW - 1) {
        result.push(gorgeId + step);
    }
}

export function nextGorgesPlayerOne(gorgeId: number, step: number, isCaptured: boolean = false) {
    let result: number[] = [];

    if (gorgeId - MAX_GORGES_PER_ROW * step > MIN_GORGE_NUMBER) {
        result.push(gorgeId - MAX_GORGES_PER_ROW * step);
    }
    
    calculateLeftAndRight(gorgeId, result, step);

    if (isCaptured && gorgeId + MAX_GORGES_PER_ROW * step < MAX_GORGE_NUMBER) {
        result.push(gorgeId + MAX_GORGES_PER_ROW * step)
    }

    return result;
}

export function nextGorgesPlayerTwo(gorgeId: number, step: number, isCaptured: boolean = false) {
    let result: number[] = [];

    if (gorgeId + MAX_GORGES_PER_ROW * step) {
        result.push(gorgeId + MAX_GORGES_PER_ROW * step);
    }
    
    calculateLeftAndRight(gorgeId, result, step);

    if (isCaptured && gorgeId - MAX_GORGES_PER_ROW * step > MIN_GORGE_NUMBER) {
        result.push(gorgeId - MAX_GORGES_PER_ROW * step);
    }

    return result;
}

export function getFullRangeFromPosition(gorgeId: number) {
    let result: number[] = [];

    for (let i = 1; i <= MAX_GORGES_PER_ROW; i++) {
        const temp = nextGorgesPlayerOne(gorgeId, i, true);

        result.push(...temp);
    }

    return result;
}