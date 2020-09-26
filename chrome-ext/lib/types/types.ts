export interface SwdsConfig {
    smallTexts__marking: boolean;
    smallTexts__minimumSize: number;
}

export interface AppState {
    analyzingStatus: string;
    config: SwdsConfig;
}