import { JavaResponse } from 'Shared/types/java';
import { DensityResult } from 'Shared/types/factors-legacy';

/**
 * 
 * @param image base64 image uri
 */
export function density(ipsDensityResult: JavaResponse['densityResult']): DensityResult {
    const percentage: number = ipsDensityResult?.densityPercentage ?? -1;
    const visitedPixels: number = ipsDensityResult?.allPixels ?? -1;
    const bgPixels: number = ipsDensityResult?.backgroundPixels ?? -1;

    return { percentage, visitedPixels, bgPixels };
}
