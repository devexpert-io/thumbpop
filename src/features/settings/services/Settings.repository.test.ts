import { createSettingsRepository } from './Settings.repository';
import { ISettingsDataSource } from '../types';

describe('SettingsRepository', () => {
    const dataSource: jest.Mocked<ISettingsDataSource> = {
        getApiKey: jest.fn(),
        saveApiKey: jest.fn(),
        getVideoContext: jest.fn(),
        saveVideoContext: jest.fn(),
    };

    const repository = createSettingsRepository(dataSource);

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
