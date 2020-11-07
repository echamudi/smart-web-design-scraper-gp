import { ImageProcessingSpringTestAll } from 'Shared/types/types';
import { DensityExtractResult } from 'Shared/types/factors';

/**
 * 
 * @param image base64 image uri
 */
export function density(ipsDensityExtractResult: ImageProcessingSpringTestAll['densityResult']): DensityExtractResult {
    const percentage: number = ipsDensityExtractResult?.densityPercentage ?? -1;
    const visitedPixels: number = ipsDensityExtractResult?.allPixels ?? -1;
    const bgPixels: number = ipsDensityExtractResult?.backgroundPixels ?? -1;

    return { percentage, visitedPixels, bgPixels };
}
