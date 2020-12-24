// TEMP

import { JavaResponse } from 'Shared/types/java';
import { DensityExtractResult } from 'Shared/types/factors';

/**
 * 
 * @param image base64 image uri
 */
export function density(ipsDensityExtractResult: JavaResponse['densityResult']): DensityExtractResult {
    const percentage: number = ipsDensityExtractResult?.densityPercentage ?? -1;
    const visitedPixels: number = ipsDensityExtractResult?.allPixels ?? -1;
    const bgPixels: number = ipsDensityExtractResult?.backgroundPixels ?? -1;

    return { percentage, visitedPixels, bgPixels };
}
