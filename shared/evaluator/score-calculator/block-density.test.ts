import { blockDensityScoreCalculate } from './block-density';

test('block density score produces correct score', () => {
    const density1 = blockDensityScoreCalculate([[0,0],[0,0.5]]);
    expect(density1).toStrictEqual({
        data: { maxDensity: 0.5, minDensity: 0, average: 0.125 },
        score: 0.875
    });

    const density2 = blockDensityScoreCalculate([]);
    expect(density2).toStrictEqual({
        data: { maxDensity: undefined, minDensity: undefined, average: undefined },
        score: undefined
    });

    const density3 = blockDensityScoreCalculate([[]]);
    expect(density3).toStrictEqual({
        data: { maxDensity: undefined, minDensity: undefined, average: undefined },
        score: undefined
    });

    const density4 = blockDensityScoreCalculate([[1,1],[1,1]]);
    expect(density4).toStrictEqual({
        data: { maxDensity: 1, minDensity: 1, average: 1 },
        score: 0
    });

    const density5 = blockDensityScoreCalculate([[0,0],[0,0]]);
    expect(density5).toStrictEqual({
        data: { maxDensity: 0, minDensity: 0, average: 0 },
        score: 1
    });
});
