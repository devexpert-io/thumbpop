import { IAISettingsRepository } from '../types';

export const createGetStoredApiKeyUseCase = (settingsRepository: IAISettingsRepository) => ({
    execute(): string | null {
        return settingsRepository.getApiKey();
    },
});
