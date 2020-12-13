import { TextSizeConfig, TextSizeResult, BrowserInfoResult, SymmetryResult, DominantColorsConfig, PicturesConfig, SymmetryConfig, ColorCountResult, DensityResult, DensityConfig, NegativeSpaceResult, VideosResult } from "./factors-legacy";
import { TextFontTypeResult } from "./factors-legacy";
import { PicturesResult } from "./factors-legacy";
import { DominantColorsResult } from "./factors-legacy";
import { ElementCountResult } from "./factors-legacy";

export interface AnalysisConfig {
    textSize: TextSizeConfig,
    dominantColors: DominantColorsConfig,
    pictures: PicturesConfig,
    symmetry: SymmetryConfig,
    density: DensityConfig
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
    negativeSpaceResult: NegativeSpaceResult;
    videosResult: VideosResult;
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
