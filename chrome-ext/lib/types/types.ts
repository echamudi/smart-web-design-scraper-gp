import { TextSizeConfig } from "../evaluator/content-side/text-size";

export interface AnalysisConfig {
    textSize: TextSizeConfig
}

export interface AppState {
    analyzingStatus: string;
    config: AnalysisConfig;
}
