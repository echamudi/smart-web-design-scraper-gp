import { FeatureExtractorResult } from 'Shared/types/feature-extractor';
import { plotter } from 'Shared/utils/canvas';
import { ComponentPosition } from 'types/types';

/**
 * Final Score Calculator
 */
export function scoreCalculator(doc: Document, features: FeatureExtractorResult) {
    const tileSize = Math.floor(features.browserInfo.viewportWidth);
    const pageHeight = features.browserInfo.scrollHeight;
    const pageWidth = features.browserInfo.scrollWidth;
    const plotterConfig = { pageHeight, pageWidth, tileSize };

    const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const textComponents: ComponentPosition[] = features.textDetection.components.map((el) => el.position);
    const textPlot = plotter(textPlotCanvas, textComponents, plotterConfig);

    const imagePlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const imageComponents: ComponentPosition[] = features.imageDetection.components.map((el) => el.position);
    const imagePlot = plotter(imagePlotCanvas, imageComponents, plotterConfig);

    const videoPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const videoComponents: ComponentPosition[] = features.videoDetection.components.map((el) => el.position);
    const videoPlot = plotter(videoPlotCanvas, videoComponents, plotterConfig);

    const anchorPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
    const anchorComponents: ComponentPosition[] = features.anchorDetection.components.map((el) => el.position);
    const anchorPlot = plotter(anchorPlotCanvas, anchorComponents, plotterConfig);
}
