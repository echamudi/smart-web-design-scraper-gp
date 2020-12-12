import { TextSizeConfig, TextSizeExtractResult, SymmetryExtractResult, DominantColorsConfig, PicturesConfig, SymmetryConfig, ColorCountExtractResult, DensityExtractResult, DensityConfig, NegativeSpaceExtractResult, VideosExtractResult } from "./factors";
import { TextFontTypeExtractResult } from "./factors";
import { PicturesExtractResult } from "./factors";
import { DominantColorsExtractResult } from "./factors";
import { ElementCountExtractResult } from "./factors";
import { ImageElementsExtractResult, TextElementsExtractResult, BrowserInfoExtractResult } from './feature-extractor';

export interface AnalysisConfig {
    textSize: TextSizeConfig,
    dominantColors: DominantColorsConfig,
    pictures: PicturesConfig,
    symmetry: SymmetryConfig,
    density: DensityConfig
}

export interface AnalysisResult {
    html: string,
    analysisConfig: AnalysisConfig,

    screenshot: string,
    textSizeResult: TextSizeExtractResult,
    textFontTypeResult: TextFontTypeExtractResult,
    picturesResult: PicturesExtractResult,
    dominantColorsResult: DominantColorsExtractResult,
    elementCountResult: ElementCountExtractResult,
    browserInfoResult: BrowserInfoExtractResult,
    symmetryResult: SymmetryExtractResult,
    colorCountResult: ColorCountExtractResult,
    densityResult: DensityExtractResult,
    negativeSpaceResult: NegativeSpaceExtractResult,
    videosResult: VideosExtractResult,
    imageElementsResult: ImageElementsExtractResult,
    textElementsResult: TextElementsExtractResult
}

export interface AppState {
    analyzingStatus: string,
    config: AnalysisConfig,
    result: Partial<AnalysisResult>,
    lastReceiptId?: string,

    /**
     * viewport snapshot
     */
    snapshot: string | null,
}

// Helpers
export interface ElementPosition {
    x: number,
    y: number,
    w: number,
    h: number
}
