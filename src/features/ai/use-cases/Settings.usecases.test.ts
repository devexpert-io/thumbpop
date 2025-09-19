import { createGetStoredApiKeyUseCase } from './GetStoredApiKey.usecase';
import { createSaveApiKeyUseCase } from './SaveApiKey.usecase';
import { createGetVideoContextUseCase } from './GetVideoContext.usecase';
import { createSaveVideoContextUseCase } from './SaveVideoContext.usecase';
import { IAISettingsRepository } from '../types';

describe('AI settings use cases', () => {
    const repository: jest.Mocked<IAISettingsRepository> = {
        getApiKey: jest.fn(),
        saveApiKey: jest.fn(),
        getVideoContext: jest.fn(),
        saveVideoContext: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('gets stored api key', () => {
        repository.getApiKey.mockReturnValue('key');
        const useCase = createGetStoredApiKeyUseCase(repository);
        expect(useCase.execute()).toBe('key');
    });

    it('saves api key', () => {
        const useCase = createSaveApiKeyUseCase(repository);
        useCase.execute('key');
        expect(repository.saveApiKey).toHaveBeenCalledWith('key');
    });

    it('gets video context', () => {
        repository.getVideoContext.mockReturnValue('context');
        const useCase = createGetVideoContextUseCase(repository);
        expect(useCase.execute()).toBe('context');
    });

    it('saves video context', () => {
        const useCase = createSaveVideoContextUseCase(repository);
        useCase.execute('context');
        expect(repository.saveVideoContext).toHaveBeenCalledWith('context');
    });
});
