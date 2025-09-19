import { IAISettingsRepository } from '../types';

export const createSaveVideoContextUseCase = (settingsRepository: IAISettingsRepository) => ({
    execute(videoContext: string): void {
        settingsRepository.saveVideoContext(videoContext);
    },
});
