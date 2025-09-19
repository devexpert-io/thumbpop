import { ISettingsRepository } from '../types';

export const createSaveApiKeyUseCase = (settingsRepository: ISettingsRepository) => ({
    execute(apiKey: string): void {
        settingsRepository.saveApiKey(apiKey);
    },
});
