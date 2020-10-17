import { TextSizeConfig, TextSizeResult, BrowserInfoResult, SymmetryResult, DominantColorsConfig, PicturesConfig, SymmetryConfig } from "./factors";
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
