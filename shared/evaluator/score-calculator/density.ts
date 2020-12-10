/**
 * Density Score
 */
export function densityScoreCalculator(distribution: number[][]) {

    let totalBlocks = 0;
    let maxDensity = -Infinity;
    let minDensity = Infinity;
    let average = 0;

    for (let row = 0; row < distribution.length; row++) {
        for (let col = 0; col < distribution[row].length; col++) {
            totalBlocks += 1;

            maxDensity = Math.max(distribution[row][col], maxDensity);
            minDensity = Math.min(distribution[row][col], minDensity);
            average += distribution[row][col];
        }
    }

    if (totalBlocks === 0) {
        return {
            data: {
                maxDensity: undefined,
                minDensity: undefined,
                average: undefined
            },
            score: undefined
        }
    }

    average /= totalBlocks;
    const score = 1 - average;

    return {
        data: {
            maxDensity,
            minDensity,
            average
        },
        score
    };
}
