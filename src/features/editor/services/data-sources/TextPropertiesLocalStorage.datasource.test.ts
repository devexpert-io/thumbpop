import { createTextPropertiesLocalStorageDataSource, getDefaultTextProperties } from './TextPropertiesLocalStorage.datasource';

describe('TextPropertiesLocalStorageDataSource', () => {
    const dataSource = createTextPropertiesLocalStorageDataSource();

    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    it('returns default properties when none stored', () => {
        const properties = dataSource.load();
        expect(properties).toEqual(getDefaultTextProperties());
    });

    it('persists and loads text properties', () => {
        dataSource.save({ fontFamily: 'Arial', fontSize: 64 });
        const loaded = dataSource.load();

        expect(loaded.fontFamily).toBe('Arial');
        expect(loaded.fontSize).toBe(64);
    });

    it('merges updates with existing values', () => {
        dataSource.save({ fontFamily: 'Anton' });
        dataSource.save({ fill: '#ff0000' });

        const loaded = dataSource.load();
        expect(loaded.fontFamily).toBe('Anton');
        expect(loaded.fill).toBe('#ff0000');
    });
});
