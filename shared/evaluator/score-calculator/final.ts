import { Phase2FeatureExtractorResult } from 'Shared/types/feature-extractor';
import { plotter } from 'Shared/utils/canvas';
import { ElementPosition } from 'Shared/types/types';
import { blockDensityScoreCalculate } from './block-density';

/**
 * Final Score Calculator
 */
export function finalScoreCalculate(doc: Document, features: Phase2FeatureExtractorResult) {
    const tileSize = Math.floor(features.browserInfo.viewportWidth / 4);
    const pageHeight = features.browserInfo.scrollHeight;
    const pageWidth = features.browserInfo.scrollWidth;
    const plotterConfig = { pageHeight, pageWidth, tileSize };

    const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const textElements: ElementPosition[] = [];
    features.textElements.elements.forEach((el) => {
        if (el.visible) textElements.push(el.position);
    });
    const { distribution: textElementDistribution } = plotter(textPlotCanvas, textElements, plotterConfig);

    const imagePlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const imageElements: ElementPosition[] = [];
    features.imageElements.elements.forEach((el) => {
        if (el.visible) imageElements.push(el.position);
    });
    const { distribution: imageElementDistribution }  = plotter(imagePlotCanvas, imageElements, plotterConfig);

    const displayCanvas: HTMLCanvasElement = doc.createElement('canvas');
    plotter(displayCanvas, textElements, { ...plotterConfig, backgroundColor: '#FFFFFF', blockColor: '#19b5fe' });
    plotter(displayCanvas, imageElements, { ...plotterConfig, blockColor: '#f2784b', skipResizingCanvas: true });

    // document.body.appendChild(displayCanvas);

    return {
        textDensity: blockDensityScoreCalculate(textElementDistribution),
        imageDensity: blockDensityScoreCalculate(imageElementDistribution)
    }
}
