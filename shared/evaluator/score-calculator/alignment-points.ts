import { scaleValue } from "Shared/utils/math";
import { AlignmentPointWeights } from "Shared/types/feature-extractor";

export interface AlignmentPointsScoreCalculateResult {
    data: {
        totalSignificantAPs: number | undefined,
        transformedAPs: AlignmentPointWeights | undefined;
    },
    score: number | undefined
}

export interface AlignmentPointsScoreCalculateConfig {
    /**
     * Minimum area covered by elements on an alignment point to be considered as significant.
     * Default: 10000 (100x100)
     */
    minimumArea?: number;
    /**
     * The number of alignment points that considered as still ok and will get 1 score.
     * Must be lower than failThreshold.
     * Default: 10
     */
    passThreshold?: number;
    /**
     * The number of alignment points that considered as too much and will get 0 score.
     * Must be higher than passThreshold.
     * Default: 40
     */
    failThreshold?: number;
    /**
     * Transform alignment points, mainly to group alignment points that are close together
     * Default: (val) => val
     */
    transformer?(val: number): number;
}

export function alignmentPointsScoreCalculate(
    alignmentPointWeights: AlignmentPointWeights,
    config?: AlignmentPointsScoreCalculateConfig): AlignmentPointsScoreCalculateResult {

    // Load configurations
    const minimumArea = config?.minimumArea ?? 10000;
    const passThreshold = config?.failThreshold ?? 10;
    const failThreshold = config?.failThreshold ?? 40;
    const transformer = config?.transformer ?? ((val: number) => val);

    const totalInitialAP =  Object.keys(alignmentPointWeights).length;

    // Guard
    if (passThreshold >= failThreshold || totalInitialAP === 0) {
        return {
            data: {
                totalSignificantAPs: undefined,
                transformedAPs: undefined
            },
            score: undefined
        }
    }

    // Transform alignment points
    const transformedAPs: AlignmentPointWeights = {};

    Object.keys(alignmentPointWeights).forEach((key) => {
        const area = alignmentPointWeights[Number(key)];
        const transformedAlignmentPoint = transformer(Number(key));

        if (transformedAPs[transformedAlignmentPoint] === undefined) {
            transformedAPs[transformedAlignmentPoint] = area;
        } else {
            transformedAPs[transformedAlignmentPoint] += area;
        }
    });


    // Filter based on the weights
    Object.keys(transformedAPs).forEach((key) => {
        const area = transformedAPs[Number(key)];

        if (area <= minimumArea) {
            delete transformedAPs[Number(key)];
        }
    });

    const totalSignificantAPs = Object.keys(transformedAPs).length;

    const score = 1 - scaleValue(totalSignificantAPs, [passThreshold, failThreshold], [0, 1]);

    return {
        data: {
            totalSignificantAPs,
            transformedAPs
        },
        score
    };
}
