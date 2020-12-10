import { FeatureExtractorResult } from 'Shared/types/feature-extractor';
import { plotter } from 'Shared/utils/canvas';
import { ElementPosition } from 'Shared/types/types';
import { blockDensityScoreCalculate } from './block-density';

/**
 * Final Score Calculator
 */
export function finalScoreCalculate(doc: Document, features: FeatureExtractorResult) {
    const tileSize = Math.floor(features.browserInfo.viewportWidth);
    const pageHeight = features.browserInfo.scrollHeight;
    const pageWidth = features.browserInfo.scrollWidth;
    const plotterConfig = { pageHeight, pageWidth, tileSize };

    const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const textElements: ElementPosition[] = features.textElements.elements.map((el) => el.position);
    const { distribution: textElementDistribution } = plotter(textPlotCanvas, textElements, plotterConfig);

    const imagePlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const imageElements: ElementPosition[] = features.imageElements.elements.map((el) => el.position);
    const { distribution: imageElementDistribution }  = plotter(imagePlotCanvas, imageElements, plotterConfig);

    // const videoPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    // const videoElements: ElementPosition[] = features.videoElements.elements.map((el) => el.position);
    // const { distribution: videoElementDistribution } = plotter(videoPlotCanvas, videoElements, plotterConfig);

    // const anchorPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    // const anchorElements: ElementPosition[] = features.anchorElements.elements.map((el) => el.position);
    // const { distribution: anchorElementDistribution } = plotter(anchorPlotCanvas, anchorElements, plotterConfig);

    return {
        textDensity: blockDensityScoreCalculate(textElementDistribution),
        imageDensity: blockDensityScoreCalculate(imageElementDistribution)
    }
}
