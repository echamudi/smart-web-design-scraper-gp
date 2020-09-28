import { TextSizeConfig, TextSizeResult } from "../chrome-ext/lib/evaluator/content-side/text-size";

export interface AnalysisConfig {
    textSize: TextSizeConfig
}

export interface AnalysisResult {
    html: string;
    analysisConfig: AnalysisConfig;

    textSizeResult: TextSizeResult;
    textFontTypeResult:  { fonts: string[] };
}

export interface AppState {
    analyzingStatus: string;
    config: AnalysisConfig;
    result: AnalysisResult | null;
    vibrantTemp: any;
    imageTemp: string | null;
}
