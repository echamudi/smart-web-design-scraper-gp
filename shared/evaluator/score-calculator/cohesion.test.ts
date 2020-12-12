import { cohesionScoreCalculate } from './cohesion';

// TODO: update test
test('standard', () => {
    expect(
        cohesionScoreCalculate([1, 2, 3, 4, 5, 6, 7, 8, 9])
    ).toStrictEqual(
        {
            data: {
                totalMembers: 9,
                members: [
                    1, 2, 3, 4, 5,
                    6, 7, 8, 9
                ],
                totalUniqueMembers: 9,
                uniqueMembers: [
                    1, 2, 3, 4, 5,
                    6, 7, 8, 9
                ]
            },
            score: 0.11111111111111116
        }
    );

    expect(
        cohesionScoreCalculate([1.64, 1.64, 1.63, 1.62, 2.12, 2.13])
    ).toStrictEqual(
        {
            data: {
                totalMembers: 6,
                members: [1.64, 1.64, 1.63, 1.62, 2.12, 2.13],
                totalUniqueMembers: 2,
                uniqueMembers: [1.6, 2.1]
            },
            score: 0.8888888888888888
        }
    );

    expect(
        cohesionScoreCalculate([5,5,5,5,5,5,5,5,5])
    ).toStrictEqual(
        {
            data: {
                totalMembers: 9,
                members: [
                    5, 5, 5, 5, 5,
                    5, 5, 5, 5
                ],
                totalUniqueMembers: 1,
                uniqueMembers: [5]
            },
            score: 1
        }
    );
});
