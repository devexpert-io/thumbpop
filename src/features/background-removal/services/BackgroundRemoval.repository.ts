import { IBackgroundRemovalDataSource, IBackgroundRemovalRepository } from '../types';

export const createBackgroundRemovalRepository = (
    dataSource: IBackgroundRemovalDataSource,
): IBackgroundRemovalRepository => ({
    async removeBackground(imageUrl: string): Promise<string> {
        return dataSource.removeBackground(imageUrl);
    },
});
