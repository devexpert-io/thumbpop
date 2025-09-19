import { IAISettingsRepository } from '../types';

export const createSaveApiKeyUseCase = (settingsRepository: IAISettingsRepository) => ({
    execute(apiKey: string): void {
        settingsRepository.saveApiKey(apiKey);
    },
});
