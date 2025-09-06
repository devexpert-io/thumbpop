import { IAIRepository } from '../../features/ai/types';
import { createEnhanceThumbnailUseCase } from '../../features/ai/use-cases/EnhanceThumbnail.usecase';
import { geminiAIDataSource } from '../../features/ai/services/data-sources/Gemini.datasource';
import { createAIRepository } from '../../features/ai/services/AI.repository';

const aiRepository = createAIRepository(geminiAIDataSource);
const enhanceThumbnailUseCase = createEnhanceThumbnailUseCase(aiRepository);

export interface DIContainer {
    enhanceThumbnailUseCase: typeof enhanceThumbnailUseCase;
    aiRepository: IAIRepository;
}

export const diContainer: DIContainer = {
    enhanceThumbnailUseCase,
    aiRepository,
};
