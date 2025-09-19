import { createBackgroundRemovalRepository } from './BackgroundRemoval.repository';
import { IBackgroundRemovalDataSource } from '../types';

describe('BackgroundRemovalRepository', () => {
    const dataSource: jest.Mocked<IBackgroundRemovalDataSource> = {
        removeBackground: jest.fn(),
    };

    const repository = createBackgroundRemovalRepository(dataSource);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('delegates background removal to data source', async () => {
        dataSource.removeBackground.mockResolvedValue('processed');
        const result = await repository.removeBackground('image');
        expect(result).toBe('processed');
        expect(dataSource.removeBackground).toHaveBeenCalledWith('image');
    });
});
