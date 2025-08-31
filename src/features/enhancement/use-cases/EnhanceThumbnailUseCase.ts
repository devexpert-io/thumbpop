import { EnhancementRepository, EnhancementParams } from '../data/repositories/EnhancementRepository';

export class EnhanceThumbnailUseCase {
  constructor(private repository: EnhancementRepository) {}

  async execute(params: EnhancementParams): Promise<string> {
    // Validate parameters
    if (!params.canvasImage) {
      throw new Error('Canvas image is required');
    }
    
    if (!params.videoContext) {
      throw new Error('Video context is required');
    }

    if (!params.isLucky && !params.userPrompt) {
      throw new Error('User prompt is required when not using lucky mode');
    }

    // Check if AI is initialized
    if (!this.repository.isInitialized()) {
      throw new Error('AI service not initialized. Please set your API key.');
    }

    // Execute enhancement
    return this.repository.enhance(params);
  }
}