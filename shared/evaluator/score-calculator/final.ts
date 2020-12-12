import { Phase2FeatureExtractorResult, ImageElement } from 'Shared/types/feature-extractor';
import { plotter, PlotterConfig } from 'Shared/utils/canvas';
import { ElementPosition } from 'Shared/types/types';
import { blockDensityScoreCalculate, BlockDensityScoreCalculateResult, BlockDensityScoreCalculateConfig } from './block-density';
import { consistencyScoreCalculate, ConsistencyScoreCalculateResult, ConsistencyScoreCalculateConfig } from './consistency';

/**
 * Final Score Calculator
 */
export class FinalScore {
    // common plotter config for element distributions
    private plotterConfig: PlotterConfig;

    // Visible detected DOM elements
    private imageElements: ImageElement[];

    // Element distributions
    private textElementDistribution: number[][];
    private imageElementDistribution: number[][];
    private majorElementDistribution: number[][];

    // Scores (Based on unique id in the Web Design Usability Components table)
    private complexityTextDom: BlockDensityScoreCalculateResult | undefined;
    private densityMajorDom: BlockDensityScoreCalculateResult | undefined;
    private cohesionImageDom: ConsistencyScoreCalculateResult | undefined;

    constructor(doc: Document, features: Phase2FeatureExtractorResult) {
        const tileSize = Math.floor(features.browserInfo.viewportWidth / 6);
        const pageHeight = features.browserInfo.scrollHeight;
        const pageWidth = features.browserInfo.scrollWidth;
        this.plotterConfig = { pageHeight, pageWidth, tileSize };

        const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const textElementPositions: ElementPosition[] = [];
        features.textElements.elements.forEach((el) => {
            if (el.visible) textElementPositions.push(el.position);
        });
        this.textElementDistribution = plotter(textPlotCanvas, textElementPositions, this.plotterConfig).distribution;

        const imagePlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const imageElements: ImageElement[] = [];
        const imageElementPositions: ElementPosition[] = [];
        features.imageElements.elements.forEach((el) => {
            if (el.visible) {
                imageElements.push(el);
                imageElementPositions.push(el.position);
            };
        });
        this.imageElementDistribution = plotter(imagePlotCanvas, imageElementPositions, this.plotterConfig).distribution;
        this.imageElements = imageElements;

        const majorPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const majorElements: ElementPosition[] = [...textElementPositions, ...imageElementPositions];
        features.videoElements.elements.forEach((el) => {
            if (el.visible) majorElements.push(el.position);
        });
        this.majorElementDistribution = plotter(majorPlotCanvas, majorElements, this.plotterConfig).distribution;

        // const displayCanvas: HTMLCanvasElement = doc.createElement('canvas');
        // plotter(displayCanvas, textElementPositions, { ...this.plotterConfig, backgroundColor: '#FFFFFF', blockColor: '#19b5fe' });
        // plotter(displayCanvas, imageElementPositions, { ...this.plotterConfig, blockColor: '#f2784b', skipResizingCanvas: true });

        this.calculateAllScores();
    }

    public calculateCohesionImageDom(config?: ConsistencyScoreCalculateConfig) {
        const usedConfig: ConsistencyScoreCalculateConfig = config ?? {
            failThreshold: 25,
            tranformer: ((val) => Math.round(val * 10) / 10)
        };
        const aspectRatios: number[] = [];
        this.imageElements.forEach((el) => {
            if (el.visible && typeof el.aspectRatio === 'number')
                aspectRatios.push(el.aspectRatio);
        });

        this.cohesionImageDom = consistencyScoreCalculate(aspectRatios, usedConfig);
    }

    public calculateComplexityTextDom(config?: BlockDensityScoreCalculateConfig) {
        const usedConfig: BlockDensityScoreCalculateConfig = config ?? {
            failPercentage: 0.75
        };
        this.complexityTextDom = blockDensityScoreCalculate(this.textElementDistribution, usedConfig);
    }

    public calculateDensityMajorDomScore(config?: BlockDensityScoreCalculateConfig) {
        const usedConfig: BlockDensityScoreCalculateConfig = config ?? {};
        this.densityMajorDom = blockDensityScoreCalculate(this.majorElementDistribution, usedConfig);
    }

    /**
     * Calculate all scores using the default config
     */
    public calculateAllScores() {
        this.calculateCohesionImageDom();
        this.calculateComplexityTextDom();
        this.calculateDensityMajorDomScore();
    }

    public getAllScores() {
        return {
            cohesionImageDom: this.cohesionImageDom,
            complexityTextDom: this.complexityTextDom,
            densityMajorDom: this.densityMajorDom
        }
    }
}
