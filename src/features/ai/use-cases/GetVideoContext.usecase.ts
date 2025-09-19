import { IAISettingsRepository } from '../types';

export const createGetVideoContextUseCase = (settingsRepository: IAISettingsRepository) => ({
    execute(): string {
        return settingsRepository.getVideoContext() ?? '';
    },
});
