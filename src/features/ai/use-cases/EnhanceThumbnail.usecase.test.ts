import { enhanceThumbnailUseCase } from './EnhanceThumbnail.usecase';
import { aiRepository } from '../services/AI.repository';
import { GenerateImageParams, IAIRepository } from '../types';

jest.mock('../services/AI.repository');

const mockedRepository = aiRepository as jest.Mocked<IAIRepository>;

describe('enhanceThumbnailUseCase', () => {
    beforeEach(() => {
        mockedRepository.enhance.mockClear();
        mockedRepository.isInitialized.mockClear();
    });

    const validParams: GenerateImageParams = {
        canvasImage: 'data:image/png;base64,test-image',
        videoContext: 'React Tutorial',
        userPrompt: 'Make it vibrant',
        isLucky: false,
    };

    describe('validation', () => {
        it('should throw error when canvasImage is missing', async () => {
            mockedRepository.isInitialized.mockReturnValue(true);
            const params = { ...validParams, canvasImage: '' };
            await expect(enhanceThumbnailUseCase.execute(params)).rejects.toThrow('Canvas image is required');
        });

        it('should throw error when videoContext is missing', async () => {
            mockedRepository.isInitialized.mockReturnValue(true);
            const params = { ...validParams, videoContext: '' };
            await expect(enhanceThumbnailUseCase.execute(params)).rejects.toThrow('Video context is required');
        });

        it('should throw error when userPrompt is missing and not in lucky mode', async () => {
            mockedRepository.isInitialized.mockReturnValue(true);
            const params = { ...validParams, userPrompt: undefined, isLucky: false };
            await expect(enhanceThumbnailUseCase.execute(params)).rejects.toThrow('User prompt is required when not using lucky mode');
        });

        it('should not require userPrompt when in lucky mode', async () => {
            mockedRepository.isInitialized.mockReturnValue(true);
            mockedRepository.enhance.mockResolvedValue('data:image/png;base64,enhanced-React Tutorial');
            const params = { ...validParams, userPrompt: undefined, isLucky: true };

            await expect(enhanceThumbnailUseCase.execute(params)).resolves.not.toThrow();
        });
    });

    describe('execution', () => {
        beforeEach(() => {
            mockedRepository.isInitialized.mockReturnValue(true);
        });

        it('should call the repository with the correct parameters', async () => {
            const expectedResult = 'data:image/png;base64,enhanced-React Tutorial';
            mockedRepository.enhance.mockResolvedValue(expectedResult);

            const result = await enhanceThumbnailUseCase.execute(validParams);

            expect(mockedRepository.enhance).toHaveBeenCalledWith(validParams);
            expect(mockedRepository.enhance).toHaveBeenCalledTimes(1);
            expect(result).toBe(expectedResult);
        });

        it('should propagate errors from the repository', async () => {
            const fakeError = new Error('AI service error');
            mockedRepository.enhance.mockRejectedValue(fakeError);

            await expect(enhanceThumbnailUseCase.execute(validParams)).rejects.toThrow('AI service error');
        });
    });
});