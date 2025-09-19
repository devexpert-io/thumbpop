import { createRemoveBackgroundUseCase } from './RemoveBackground.usecase';
import { IBackgroundRemovalRepository } from '../types';

describe('RemoveBackgroundUseCase', () => {
    const repository: jest.Mocked<IBackgroundRemovalRepository> = {
        removeBackground: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('delegates to repository', async () => {
        repository.removeBackground.mockResolvedValue('processed');
        const useCase = createRemoveBackgroundUseCase(repository);
        const result = await useCase.execute('image');
        expect(result).toBe('processed');
        expect(repository.removeBackground).toHaveBeenCalledWith('image');
    });
});
