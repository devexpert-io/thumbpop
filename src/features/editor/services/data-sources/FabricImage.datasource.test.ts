jest.mock('fabric', () => ({
    FabricImage: {
        fromURL: jest.fn(),
    },
}));

import { FabricImage } from 'fabric';
import { createFabricImageDataSource } from './FabricImage.datasource';

describe('FabricImageDataSource', () => {
    it('loads image with cross origin', async () => {
        const mockImage = { set: jest.fn() };
        (FabricImage.fromURL as jest.Mock).mockResolvedValue(mockImage);
        const dataSource = createFabricImageDataSource();

        const result = await dataSource.load('image-url');
        expect(FabricImage.fromURL).toHaveBeenCalledWith('image-url', { crossOrigin: 'anonymous' });
        expect(result).toBe(mockImage);
    });
});
