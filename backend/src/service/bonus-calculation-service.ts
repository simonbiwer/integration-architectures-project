export function socialPerformanceBonus(targetValue: number, actualValue: number) {
    const objectMap: { [key: number]: number } = {
        "-5": 0,
        "-4": 0,
        "-3": 0,
        "-2": 10,
        "-1": 20,
        "0": 50,
        "1": 100,
        "2": 125,
        "3": 150,
        "4": 150,
        "5": 150,
    };
    return objectMap[actualValue - targetValue];
}

export function orderEvaluationBonus(
    clientRanking: number,
    price: number,
    nrOfItems: number
) {
    return ((price * nrOfItems) / 10) * (1 + (5 - clientRanking) / 10);
}
