import { GoogleGenAI } from '@google/genai';
import { EnhancementRepository } from '../../../features/enhancement/data/repositories/EnhancementRepository';
import { GeminiDataSource } from '../../../features/enhancement/infrastructure/gemini/GeminiDataSource';
import { EnhanceThumbnailUseCase } from '../../../features/enhancement/use-cases/EnhanceThumbnailUseCase';

export interface DIContainer {
  // Enhancement feature
  enhancementRepository: EnhancementRepository;
  enhanceThumbnailUseCase: EnhanceThumbnailUseCase;
}

export function createDIContainer(): DIContainer {
  // Create external dependencies
  const genAI = new GoogleGenAI({ apiKey: '' }); // Will be initialized later

  // Create data sources
  const geminiDataSource = new GeminiDataSource(genAI);

  // Create repositories
  const enhancementRepository = new EnhancementRepository(geminiDataSource);

  // Create use cases
  const enhanceThumbnailUseCase = new EnhanceThumbnailUseCase(enhancementRepository);

  return {
    enhancementRepository,
    enhanceThumbnailUseCase,
  };
}