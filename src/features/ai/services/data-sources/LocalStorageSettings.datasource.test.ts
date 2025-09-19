import { createLocalStorageAISettingsDataSource } from './LocalStorageSettings.datasource';

describe('LocalStorageAISettingsDataSource', () => {
    const dataSource = createLocalStorageAISettingsDataSource();

    beforeEach(() => {
        localStorage.clear();
    });

    it('saves and loads api key', () => {
        dataSource.saveApiKey('key');
        expect(dataSource.getApiKey()).toBe('key');
    });

    it('saves and loads video context', () => {
        dataSource.saveVideoContext('context');
        expect(dataSource.getVideoContext()).toBe('context');
    });

    it('handles missing values gracefully', () => {
        expect(dataSource.getApiKey()).toBeNull();
        expect(dataSource.getVideoContext()).toBeNull();
    });
});
