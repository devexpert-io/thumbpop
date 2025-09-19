import { createCanvasStateLocalStorageDataSource } from './CanvasStateLocalStorage.datasource';

describe('CanvasStateLocalStorageDataSource', () => {
    const dataSource = createCanvasStateLocalStorageDataSource();

    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    it('saves and loads canvas state', async () => {
        const state = {
            objects: { objects: [] },
            backgroundColor: '#ffffff',
        };

        await dataSource.save(state);
        const loaded = await dataSource.load();

        expect(loaded).toEqual({
            objects: state.objects,
            backgroundColor: state.backgroundColor,
        });
    });

    it('returns null when there is no stored state', async () => {
        const loaded = await dataSource.load();
        expect(loaded).toBeNull();
    });

    it('clears stored state', async () => {
        const state = {
            objects: { objects: [] },
            backgroundColor: '#000000',
        };

        await dataSource.save(state);
        await dataSource.clear();
        const loaded = await dataSource.load();

        expect(loaded).toBeNull();
    });
});
