import { IAIRepository } from '../../features/ai/types';
import { enhanceThumbnailUseCase } from '../../features/ai/use-cases/EnhanceThumbnail.usecase';
import { aiRepository } from '../../features/ai/services/AI.repository';

export interface DIContainer {
    enhanceThumbnailUseCase: typeof enhanceThumbnailUseCase;
    aiRepository: IAIRepository;
}

export const diContainer: DIContainer = {
    enhanceThumbnailUseCase,
    aiRepository,
};