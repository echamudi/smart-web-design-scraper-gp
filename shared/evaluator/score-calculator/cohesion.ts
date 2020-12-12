import { scaleValue } from "Shared/utils/math";

export interface CohesionScoreCalculateResult {
    data: {
        totalMembers: number | undefined,
        members: number[] | undefined;
        /**
         * Total members without duplicate
         */
        totalUniqueMembers: number | undefined,
        uniqueMembers: number[] | undefined;
    },
    score: number | undefined
}

export function cohesionScoreCalculate(members: number[]): CohesionScoreCalculateResult {
    if (members.length === 0) return {
        data: {
            totalMembers: undefined,
            members: undefined,
            totalUniqueMembers: undefined,
            uniqueMembers: undefined
        },
        score: undefined
    };

    // Rounding to 1 decimal place
    const roundedNumbers = members.map((val) => Math.round(val * 10) / 10);
    const totalMembers = roundedNumbers.length;
    const uniqueMembers = [...new Set(roundedNumbers)];
    const totalUniqueMembers = uniqueMembers.length;

    const scaledTotalUniqueMembers = scaleValue(totalUniqueMembers, [1, 25], [0, 1]);
    const score = 1 - scaledTotalUniqueMembers;

    return {
        data: { totalMembers, members, totalUniqueMembers, uniqueMembers},
        score
    }
}
