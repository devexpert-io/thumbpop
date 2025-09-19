import { FabricImage } from 'fabric';
import { IImageDataSource } from '../../types';

export const createFabricImageDataSource = (): IImageDataSource => ({
    async load(imageUrl: string): Promise<FabricImage> {
        return FabricImage.fromURL(imageUrl, {
            crossOrigin: 'anonymous',
        });
    },
});
