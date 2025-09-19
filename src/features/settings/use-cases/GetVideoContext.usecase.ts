import { ISettingsRepository } from '../types';

export const createGetVideoContextUseCase = (settingsRepository: ISettingsRepository) => ({
    execute(): string | null {
        return settingsRepository.getVideoContext();
    },
});
