import { IAIRepository } from '../types';
import { GenerateImageParams } from '../types';

export const createEnhanceThumbnailUseCase = (aiRepository: IAIRepository) => ({
    async execute(params: GenerateImageParams): Promise<string> {
        if (!params.canvasImage) {
            throw new Error('Canvas image is required');
        }

        if (!params.videoContext) {
            throw new Error('Video context is required');
        }

        if (!params.isLucky && !params.userPrompt) {
            throw new Error('User prompt is required when not using lucky mode');
        }

        if (!aiRepository.isInitialized()) {
            throw new Error('AI service not initialized. Please set your API key.');
        }

        return aiRepository.enhance(params);
    },
});
