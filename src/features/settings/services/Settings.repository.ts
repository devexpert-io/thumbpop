import { ISettingsDataSource, ISettingsRepository } from '../types';

export const createSettingsRepository = (
    settingsDataSource: ISettingsDataSource,
): ISettingsRepository => ({
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
