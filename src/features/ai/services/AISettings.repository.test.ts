import { createAISettingsRepository } from './AISettings.repository';
import { IAISettingsDataSource } from '../types';

describe('AISettingsRepository', () => {
    const dataSource: jest.Mocked<IAISettingsDataSource> = {
        getApiKey: jest.fn(),
        saveApiKey: jest.fn(),
        getVideoContext: jest.fn(),
        saveVideoContext: jest.fn(),
    };

    const repository = createAISettingsRepository(dataSource);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('delegates api key operations', () => {
        dataSource.getApiKey.mockReturnValue('key');
        expect(repository.getApiKey()).toBe('key');
        repository.saveApiKey('other');
        expect(dataSource.saveApiKey).toHaveBeenCalledWith('other');
    });

    it('delegates video context operations', () => {
        dataSource.getVideoContext.mockReturnValue('context');
        expect(repository.getVideoContext()).toBe('context');
        repository.saveVideoContext('new');
        expect(dataSource.saveVideoContext).toHaveBeenCalledWith('new');
    });
});
