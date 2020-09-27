export interface SwdsConfig {
    textSize__marking: boolean;
    textSize__minimumSize: number;
}

export interface AppState {
    analyzingStatus: string;
    config: SwdsConfig;
}