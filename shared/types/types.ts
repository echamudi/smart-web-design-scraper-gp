import { TextSizeConfig, TextSizeResult, BrowserInfoResult, SymmetryResult, DominantColorsConfig, PicturesConfig, SymmetryConfig, ColorCountResult, DensityResult } from "./factors";
import { TextFontTypeResult } from "./factors";
import { PicturesResult } from "./factors";
import { DominantColorsResult } from "./factors";
import { ElementCountResult } from "./factors";

export interface AnalysisConfig {
    textSize: TextSizeConfig,
    dominantColors: DominantColorsConfig,
    pictures: PicturesConfig,
    symmetry: SymmetryConfig
}

export interface AnalysisResult {
    html: string;
    analysisConfig: AnalysisConfig;

    screenshot: string;
    textSizeResult: TextSizeResult;
    textFontTypeResult: TextFontTypeResult;
    picturesResult: PicturesResult;
    dominantColorsResult: DominantColorsResult;
    elementCountResult: ElementCountResult;
    browserInfoResult: BrowserInfoResult;
    symmetryResult: SymmetryResult;
    colorCountResult: ColorCountResult;
    densityResult: DensityResult;
}

export interface AppState {
    analyzingStatus: string;
    config: AnalysisConfig;
    result: Partial<AnalysisResult>;
    lastReceiptId?: string,

    /**
     * viewport snapshot
     */
    snapshot: string | null;
}

export interface ImageProcessingSpringTestAll {
    symmetryResult?: {
        horizontalSymmetry?: {
            percentage?: number,
            allVisitedPixels?: number,
            symmetricalPixels?: number,
            nonSymmetricalPixels?: number
        },
        verticalSymmetry?: {
            percentage?: number,
            allVisitedPixels?: number,
            symmetricalPixels?: number,
            nonSymmetricalPixels?: number
        }
    },
    densityResult?: {
        densityPercentage?: number,
        allPixels?: number,
        backgroundColor?: number,
        backgroundPixels?: number
    },
    negativeSpaceResult?: {
        negativeSpacePercentage?: number,
        allPixels?: number,
        backgroundColor?: number,
        backgroundPixels?: number
    }
}
