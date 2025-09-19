export interface ISettingsDataSource {
    getApiKey(): string | null;
    saveApiKey(apiKey: string): void;
    getVideoContext(): string | null;
    saveVideoContext(videoContext: string): void;
}

export interface ISettingsRepository {
    getApiKey(): string | null;
    saveApiKey(apiKey: string): void;
    getVideoContext(): string | null;
    saveVideoContext(videoContext: string): void;
}
