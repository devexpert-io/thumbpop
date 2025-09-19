import { IBackgroundRemovalRepository } from '../types';

export const createRemoveBackgroundUseCase = (repository: IBackgroundRemovalRepository) => ({
    async execute(imageUrl: string): Promise<string> {
        return repository.removeBackground(imageUrl);
    },
});
