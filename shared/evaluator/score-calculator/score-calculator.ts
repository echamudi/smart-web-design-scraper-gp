import { FeatureExtractorResult } from 'Shared/types/feature-extractor';
import { plotter } from 'Shared/utils/canvas';
import { ElementPosition } from 'types/types';

/**
 * Final Score Calculator
 */
export function scoreCalculator(doc: Document, features: FeatureExtractorResult) {
    const tileSize = Math.floor(features.browserInfo.viewportWidth);
    const pageHeight = features.browserInfo.scrollHeight;
    const pageWidth = features.browserInfo.scrollWidth;
    const plotterConfig = { pageHeight, pageWidth, tileSize };

    const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const textComponents: ElementPosition[] = features.textElements.elements.map((el) => el.position);
    const textPlot = plotter(textPlotCanvas, textComponents, plotterConfig);

    const imagePlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const imageComponents: ElementPosition[] = features.imageElements.elements.map((el) => el.position);
    const imagePlot = plotter(imagePlotCanvas, imageComponents, plotterConfig);

    const videoPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const videoComponents: ElementPosition[] = features.videoElements.elements.map((el) => el.position);
    const videoPlot = plotter(videoPlotCanvas, videoComponents, plotterConfig);

    const anchorPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const anchorComponents: ElementPosition[] = features.anchorElements.elements.map((el) => el.position);
    const anchorPlot = plotter(anchorPlotCanvas, anchorComponents, plotterConfig);
}
