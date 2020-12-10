import { densityScoreCalculate } from './density';

test('density score produces correct score', () => {
    const density1 = densityScoreCalculate([[0,0],[0,0.5]]);
    expect(density1).toStrictEqual({
        data: { maxDensity: 0.5, minDensity: 0, average: 0.125 },
        score: 0.875
    });

    const density2 = densityScoreCalculate([]);
    expect(density2).toStrictEqual({
        data: { maxDensity: undefined, minDensity: undefined, average: undefined },
        score: undefined
    });

    const density3 = densityScoreCalculate([[]]);
    expect(density3).toStrictEqual({
        data: { maxDensity: undefined, minDensity: undefined, average: undefined },
        score: undefined
    });
});
