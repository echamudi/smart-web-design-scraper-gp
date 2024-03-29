import { Phase2FeatureExtractorResult, ImageElement, TextElement } from 'Shared/types/feature-extractor';
import { plotter, PlotterConfig } from 'Shared/utils/canvas';
import { ElementPosition } from 'Shared/types/types';
import { blockDensityScoreCalculate, BlockDensityScoreCalculateResult, BlockDensityScoreCalculateConfig } from './block-density';
import { consistencyScoreCalculate, ConsistencyScoreCalculateResult, ConsistencyScoreCalculateConfig } from './consistency';
import { AlignmentPointsScoreCalculateResult, AlignmentPointsScoreCalculateConfig, alignmentPointsScoreCalculate } from './alignment-points';
import { symmetry } from 'Shared/evaluator/extension-side/symmetry';
import { density } from 'Shared/evaluator/extension-side/density';

/**
 * Final Score Calculator
 */
export class FinalScore {
    public phase2Features: Phase2FeatureExtractorResult;

    // common plotter config for element distributions
    public plotterConfig: PlotterConfig;

    // Visible detected DOM elements
    public imageElements: ImageElement[];
    public imageElementPositions: ElementPosition[];
    public textElements: TextElement[];
    public textElementPositions: ElementPosition[];

    // Element distributions
    public textElementDistribution: number[][];
    public imageElementDistribution: number[][];
    public majorElementDistribution: number[][];

    // Scores (Based on unique id in the Web Design Usability Components table)
    public symmetryPixelLR: {score: number} | undefined;
    public symmetryPixelTB: {score: number} | undefined;
    public densityPixel:  {score: number} | undefined;
    public complexityTextDom: BlockDensityScoreCalculateResult | undefined;
    public densityMajorDom: BlockDensityScoreCalculateResult | undefined;
    public cohesionImageDom: ConsistencyScoreCalculateResult | undefined;
    public economyImageDom: ConsistencyScoreCalculateResult | undefined;
    public economyTextDom: ConsistencyScoreCalculateResult | undefined;
    public simplicityHorizontal: AlignmentPointsScoreCalculateResult | undefined;
    public simplicityVertical: AlignmentPointsScoreCalculateResult | undefined;

    // Display Canvas
    public displayCanvas: HTMLCanvasElement | undefined;

    constructor(doc: Document, features: Phase2FeatureExtractorResult) {
        // Save features to the object
        this.phase2Features = features;

        // Construct config for plotter
        const tileSize = Math.floor(features.browserInfo.viewportWidth / 6);
        const pageHeight = features.browserInfo.scrollHeight;
        const pageWidth = features.browserInfo.scrollWidth;
        this.plotterConfig = { pageHeight, pageWidth, tileSize };

        // Text Elements
        const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const textElements: TextElement[] = [];
        const textElementPositions: ElementPosition[] = [];
        features.textElements.elements.forEach((el) => {
            if (el.visible) {
                textElements.push(el);
                textElementPositions.push(el.position);
            };
        });
        this.textElementDistribution = plotter(textPlotCanvas, textElementPositions, this.plotterConfig).distribution;
        this.textElements = textElements;
        this.textElementPositions = textElementPositions;

        // Image Elements
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
        this.imageElementPositions = imageElementPositions;

        // Major Elements
        const majorPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        const majorElements: ElementPosition[] = [...textElementPositions, ...imageElementPositions];
        features.videoElements.elements.forEach((el) => {
            if (el.visible) majorElements.push(el.position);
        });
        this.majorElementDistribution = plotter(majorPlotCanvas, majorElements, this.plotterConfig).distribution;

        // Display canvas is just for visualization view (TEMP)

        const displayCanvas: HTMLCanvasElement = doc.createElement('canvas');
        plotter(displayCanvas, imageElementPositions, { ...this.plotterConfig, backgroundColor: '#FFFFFF', blockColor: 'rgba(242, 120, 75, 0.7)' });
        plotter(displayCanvas, textElementPositions, { ...this.plotterConfig, blockColor: 'rgba(25, 181, 254, 0.7)', skipResizingCanvas: true });

        this.displayCanvas = displayCanvas;

        this.calculateAllScores();
    }

    public calculateSymmetryPixelLR() {
        const symmetryExtract = symmetry(this.phase2Features.javaResponse?.symmetryResult);
        this.symmetryPixelLR = { score: symmetryExtract.lrExactSymmetricalPixels / symmetryExtract.visitedPixels };
    }

    public calculateSymmetryPixelTB() {
        const symmetryExtract = symmetry(this.phase2Features.javaResponse?.symmetryResult);
        this.symmetryPixelTB = { score: symmetryExtract.tbExactSymmetricalPixels/ symmetryExtract.visitedPixels };
    }

    public calculateDensityPixel() {
        const densityExtract = density(this.phase2Features.javaResponse?.densityResult);
        this.densityPixel = { score: (1 - densityExtract.percentage / 100) };
    }

    public calculateComplexityTextDom(config?: BlockDensityScoreCalculateConfig) {
        const usedConfig: BlockDensityScoreCalculateConfig = config ?? {
            failPercentage: 0.75
        };
        this.complexityTextDom = blockDensityScoreCalculate(this.textElementDistribution, usedConfig);
    }

    public calculateDensityMajorDom(config?: BlockDensityScoreCalculateConfig) {
        const usedConfig: BlockDensityScoreCalculateConfig = config ?? {};
        this.densityMajorDom = blockDensityScoreCalculate(this.majorElementDistribution, usedConfig);
    }

    public calculateCohesionImageDom(config?: ConsistencyScoreCalculateConfig) {
        const usedConfig: ConsistencyScoreCalculateConfig = config ?? {
            failThreshold: 25,
            transformer: ((val) => Math.round(val * 10) / 10)
        };
        const aspectRatios: number[] = [];
        this.imageElements.forEach((el) => {
            if (el.visible && typeof el.aspectRatio === 'number')
                aspectRatios.push(el.aspectRatio);
        });

        this.cohesionImageDom = consistencyScoreCalculate(aspectRatios, usedConfig);
    }

    public calculateEconomyImageDom(config?: ConsistencyScoreCalculateConfig) {
        const usedConfig: ConsistencyScoreCalculateConfig = config ?? {
            failThreshold: 30,
            transformer: ((val) => Math.round(val / 10000))
        };
        const areas: number[] = [];
        this.imageElements.forEach((el) => {
            if (el.visible && typeof el.area === 'number')
            areas.push(el.area);
        });
        this.economyImageDom = consistencyScoreCalculate(areas, usedConfig);
    }

    public calculateEconomyTextDom(config?: ConsistencyScoreCalculateConfig) {
        const usedConfig: ConsistencyScoreCalculateConfig = config ?? {
            failThreshold: 30,
            transformer: ((val) => Math.round(val / 10000))
        };
        const areas: number[] = [];
        this.textElements.forEach((el) => {
            if (el.visible && typeof el.area === 'number')
            areas.push(el.area);
        });
        this.economyTextDom = consistencyScoreCalculate(areas, usedConfig);
    }

    public calculateSimplicityHorizontal(config?: AlignmentPointsScoreCalculateConfig) {
        const usedConfig: AlignmentPointsScoreCalculateConfig = config ?? {
            transformer: (val) => Math.floor(val / 10)
        };
        this.simplicityHorizontal = alignmentPointsScoreCalculate(
            this.phase2Features.alignmentPoints.xAlignmentPoints,
            usedConfig
        );
    }

    public calculateSimplicityVertical(config?: AlignmentPointsScoreCalculateConfig) {
        const usedConfig: AlignmentPointsScoreCalculateConfig = config ?? {
            transformer: (val) => Math.floor(val / 10)
        };
        this.simplicityVertical = alignmentPointsScoreCalculate(
            this.phase2Features.alignmentPoints.yAlignmentPoints,
            usedConfig
        );
    }

    /**
     * Calculate all scores using the default config
     */
    public calculateAllScores() {
        this.calculateSymmetryPixelLR();
        this.calculateSymmetryPixelTB();
        this.calculateDensityPixel();
        this.calculateComplexityTextDom();
        this.calculateDensityMajorDom();
        this.calculateCohesionImageDom();
        this.calculateEconomyImageDom();
        this.calculateEconomyTextDom();
        this.calculateSimplicityHorizontal();
        this.calculateSimplicityVertical();
    }

    public getAllScores() {
        return {
            symmetryPixelLR: this.symmetryPixelLR,
            symmetryPixelTB: this.symmetryPixelTB,
            densityPixel: this.densityPixel,
            complexityTextDom: this.complexityTextDom,
            densityMajorDom: this.densityMajorDom,
            cohesionImageDom: this.cohesionImageDom,
            economyImageDom: this.economyImageDom,
            economyTextDom: this.economyTextDom,
            simplicityHorizontal: this.simplicityHorizontal,
            simplicityVertical: this.simplicityVertical
        }
    }
}

// TEMP
export type FinalScoreGetAllScores = ReturnType<FinalScore['getAllScores']>
