import { ISettingsRepository } from '../types';

export const createSaveVideoContextUseCase = (settingsRepository: ISettingsRepository) => ({
    execute(videoContext: string): void {
        settingsRepository.saveVideoContext(videoContext);
    },
});
