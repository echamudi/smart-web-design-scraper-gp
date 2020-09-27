import { TextSizeConfig } from "../evaluator/content-side/text-size";

export interface SwdsConfig {
    textSize: TextSizeConfig
}

export interface AppState {
    analyzingStatus: string;
    config: SwdsConfig;
}
