import { TextSizeConfig, TextSizeResult } from "../chrome-ext/lib/evaluator/content-side/text-size";
import { TextFontTypeResult } from "../chrome-ext/lib/evaluator/content-side/text-font-type";
import { PicturesResult } from "../chrome-ext/lib/evaluator/content-side/pictures";
import { ColorHarmonyResult } from "../chrome-ext/lib/evaluator/extension-side/color-harmony";

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
