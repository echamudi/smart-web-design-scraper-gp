import { TextSizeConfig, TextSizeResult } from "./factors";
import { TextFontTypeResult } from "./factors";
import { PicturesResult } from "./factors";
import { ColorHarmonyResult } from "./factors";
import { ElementCountResult } from "./factors";

export interface AnalysisConfig {
    textSize: TextSizeConfig
}

export interface AnalysisResult {
    html?: string;
    analysisConfig?: AnalysisConfig;

    textSizeResult?: TextSizeResult;
    textFontTypeResult?: TextFontTypeResult;
    picturesResult?: PicturesResult;
    colorHarmonyResult?: ColorHarmonyResult;
    elementCountResult?: ElementCountResult;
}

export interface AppState {
    analyzingStatus: string;
    config: AnalysisConfig;
    result: AnalysisResult;

    /**
     * viewport snapshot
     */
    snapshot: string | null;
}
