import { TextSizeConfig, TextSizeResult } from "../chrome-ext/lib/evaluator/content-side/text-size";
import { TextFontTypeResult } from "../chrome-ext/lib/evaluator/content-side/text-font-type";
import { PicturesResult } from "../chrome-ext/lib/evaluator/content-side/pictures";

export interface AnalysisConfig {
    textSize: TextSizeConfig
}

export interface AnalysisResult {
    html: string;
    analysisConfig: AnalysisConfig;

    textSizeResult: TextSizeResult;
    textFontTypeResult: TextFontTypeResult;
    picturesResult: PicturesResult;
}

export interface AppState {
    analyzingStatus: string;
    config: AnalysisConfig;
    result: AnalysisResult | null;
    vibrantTemp: any;
    imageTemp: string | null;
}
