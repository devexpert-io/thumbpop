import { IAISettingsDataSource, IAISettingsRepository } from '../types';

export const createAISettingsRepository = (
    settingsDataSource: IAISettingsDataSource,
): IAISettingsRepository => ({
    getApiKey(): string | null {
        return settingsDataSource.getApiKey();
    },

    saveApiKey(apiKey: string): void {
        settingsDataSource.saveApiKey(apiKey);
    },

    getVideoContext(): string | null {
        return settingsDataSource.getVideoContext();
    },

    saveVideoContext(videoContext: string): void {
        settingsDataSource.saveVideoContext(videoContext);
    },
});
