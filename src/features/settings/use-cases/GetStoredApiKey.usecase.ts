import { ISettingsRepository } from '../types';

export const createGetStoredApiKeyUseCase = (settingsRepository: ISettingsRepository) => ({
    execute(): string | null {
        return settingsRepository.getApiKey();
    },
});
