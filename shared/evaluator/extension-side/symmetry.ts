import { SymmetryExtractResult } from 'Shared/types/factors';
import { ImageProcessingSpringTestAll } from 'Shared/types/types';

/**
 * 
 * @param image base64 image uri
 */
export function symmetry(ipsSymmetryResult: ImageProcessingSpringTestAll['symmetryResult']): SymmetryExtractResult {
    const visitedPixelsRaw: any = ipsSymmetryResult?.horizontalSymmetry?.allVisitedPixels;
    const tbExactSymmetricalPixelsRaw: any = ipsSymmetryResult?.verticalSymmetry?.symmetricalPixels;
    const lrExactSymmetricalPixelsRaw: any = ipsSymmetryResult?.horizontalSymmetry?.symmetricalPixels;

    let visitedPixels: number;
    let tbExactSymmetricalPixels: number;
    let lrExactSymmetricalPixels: number;

    if (typeof visitedPixelsRaw === 'number') {
        visitedPixels = Math.floor(visitedPixelsRaw)
    } else {
        visitedPixels = -1;
    }

    if (typeof tbExactSymmetricalPixelsRaw === 'number') {
        tbExactSymmetricalPixels = Math.floor(tbExactSymmetricalPixelsRaw)
    } else {
        tbExactSymmetricalPixels = -1;
    }

    if (typeof lrExactSymmetricalPixelsRaw === 'number') {
        lrExactSymmetricalPixels = Math.floor(lrExactSymmetricalPixelsRaw)
    } else {
        lrExactSymmetricalPixels = -1;
    }

    return { visitedPixels, tbExactSymmetricalPixels, lrExactSymmetricalPixels };
}
