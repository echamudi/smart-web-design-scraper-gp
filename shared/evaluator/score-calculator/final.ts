import { Phase2FeatureExtractorResult } from 'Shared/types/feature-extractor';
import { plotter, PlotterConfig } from 'Shared/utils/canvas';
import { ElementPosition } from 'Shared/types/types';
import { blockDensityScoreCalculate, BlockDensityScoreCalculateResult, BlockDensityScoreCalculateConfig } from './block-density';

/**
 * Final Score Calculator
 */
export class FinalScore {
    // common plotter config for element distributions
    private plotterConfig: PlotterConfig;

    // Element distributions
    private textElementDistribution: number[][];
    private imageElementDistribution: number[][];
    private majorElementDistribution: number[][];

    // Scores (Based on unique id in the Web Design Usability Components table)
    private densityMajorDom: BlockDensityScoreCalculateResult | undefined;

    constructor(doc: Document, features: Phase2FeatureExtractorResult) {
        const tileSize = Math.floor(features.browserInfo.viewportWidth / 4);
        const pageHeight = features.browserInfo.scrollHeight;
        const pageWidth = features.browserInfo.scrollWidth;
        this.plotterConfig = { pageHeight, pageWidth, tileSize };

        const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const textElements: ElementPosition[] = [];
        features.textElements.elements.forEach((el) => {
            if (el.visible) textElements.push(el.position);
        });
        this.textElementDistribution = plotter(textPlotCanvas, textElements, this.plotterConfig).distribution;

        const imagePlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const imageElements: ElementPosition[] = [];
        features.imageElements.elements.forEach((el) => {
            if (el.visible) imageElements.push(el.position);
        });
        this.imageElementDistribution = plotter(imagePlotCanvas, imageElements, this.plotterConfig).distribution;

        const majorPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const majorElements: ElementPosition[] = [...textElements, ...imageElements];
        features.videoElements.elements.forEach((el) => {
            if (el.visible) majorElements.push(el.position);
        });
        this.majorElementDistribution = plotter(majorPlotCanvas, majorElements, this.plotterConfig).distribution;

        // const displayCanvas: HTMLCanvasElement = doc.createElement('canvas');
        // plotter(displayCanvas, textElements, { ...this.plotterConfig, backgroundColor: '#FFFFFF', blockColor: '#19b5fe' });
        // plotter(displayCanvas, imageElements, { ...this.plotterConfig, blockColor: '#f2784b', skipResizingCanvas: true });

        this.calculateAllScores();
    }

    public calculateDensityMajorDomScore(config?: BlockDensityScoreCalculateConfig) {
        this.densityMajorDom = blockDensityScoreCalculate(this.textElementDistribution, config);
    }

    /**
     * Calculate all scores using the default config
     */
    public calculateAllScores() {
        this.calculateDensityMajorDomScore();
    }

    public getAllScores() {
        return {
            densityMajorDom: this.densityMajorDom
        }
    }
}
