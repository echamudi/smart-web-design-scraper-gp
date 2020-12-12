// import { standardDeviation } from 'simple-statistics';
// import { sigmoid, scaleValue } from 'Shared/utils/math';

// export interface ConsistencyScoreCalculateResult {
//     data: {
//                 /**
//                  * Standard Deviation of original array
//                  */
//         standardDeviation: number | undefined,
//                 /**
//                  * Standard Deviation of scaled array
//                  */
//         scaledSD: number | undefined,
//                 /**
//                  * Standard Deviation of scaled array
//                  */
//         clampedSD: number | undefined,
//     },
//     score: number | undefined
// }

// /**
//  * Calculate similarity of positive numbers, don't input negative numbers
//  */
// export function consistencyScoreCalculate(numbers: number[]):
//     ConsistencyScoreCalculateResult {

//     if (numbers.length === 0) {
//         return {
//             data: {
//                 standardDeviation: undefined,
//                 scaledSD: undefined,
//                 clampedSD: undefined
//             },
//             score: undefined
//         }
//     }

//     const max = Math.max(...numbers);

//     const scaledNumbers: number[] = numbers.map((num) => num / max);

//     const sd = standardDeviation(numbers); 
//     const scaledSD = standardDeviation(scaledNumbers); 

//     // The most inconsistent numbers ([0,1,2,3,4,5,6,7,8,9]) will have sd around 0.288
//     // Therefore, we will clamp that as the worst score

//     const clampedSD = scaleValue(scaledSD, [0,0.5], [0,1]);
//     const score = 1 - clampedSD;

//     return {
//         data: {
//             standardDeviation: sd,
//             scaledSD,
//             clampedSD
//         },
//         score
//     };
// }
