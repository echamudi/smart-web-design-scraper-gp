import { ImageProcessingSpringTestAll } from 'Shared/types/types';
import { DensityResult } from 'Shared/types/factors';

/**
 * 
 * @param image base64 image uri
 */
export function density(ipsDensityResult: ImageProcessingSpringTestAll['densityResult']): DensityResult {
    const percentage: number = ipsDensityResult?.densityPercentage ?? -1;

    return { percentage };
}
