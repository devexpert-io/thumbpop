import { EnhanceThumbnailUseCase } from './EnhanceThumbnailUseCase';
import { EnhancementRepository, EnhancementParams } from '../data/repositories/EnhancementRepository';
import { AIDataSource, GenerateImageParams } from '../data/data-sources/AIDataSource';

class FakeAIDataSource implements AIDataSource {
  private initialized = false;
  private shouldThrowError = false;

  initialize(apiKey: string): void {
    this.initialized = apiKey.length > 0;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async generateImage(params: GenerateImageParams): Promise<string> {
    if (this.shouldThrowError) {
      throw new Error('AI service error');
    }
    return `data:image/png;base64,enhanced-${params.videoContext}`;
  }

  setShouldThrowError(shouldThrow: boolean) {
    this.shouldThrowError = shouldThrow;
  }
}

describe('EnhanceThumbnailUseCase', () => {
  let fakeDataSource: FakeAIDataSource;
  let repository: EnhancementRepository;
  let useCase: EnhanceThumbnailUseCase;

  beforeEach(() => {
    fakeDataSource = new FakeAIDataSource();
    repository = new EnhancementRepository(fakeDataSource);
    useCase = new EnhanceThumbnailUseCase(repository);
  });

  const validParams: EnhancementParams = {
    canvasImage: 'data:image/png;base64,test-image',
    videoContext: 'React Tutorial',
    userPrompt: 'Make it vibrant',
    isLucky: false,
  };

  describe('validation', () => {
    it('should throw error when canvasImage is missing', async () => {
      const params = { ...validParams, canvasImage: '' };

      await expect(useCase.execute(params)).rejects.toThrow('Canvas image is required');
    });

    it('should throw error when videoContext is missing', async () => {
      const params = { ...validParams, videoContext: '' };

      await expect(useCase.execute(params)).rejects.toThrow('Video context is required');
    });

    it('should throw error when userPrompt is missing and not in lucky mode', async () => {
      const params = { ...validParams, userPrompt: '', isLucky: false };

      await expect(useCase.execute(params)).rejects.toThrow('User prompt is required when not using lucky mode');
    });

    it('should not require userPrompt when in lucky mode', async () => {
      repository.initialize('test-api-key');
      const params = { ...validParams, userPrompt: undefined, isLucky: true };

      const result = await useCase.execute(params);

      expect(result).toBe('data:image/png;base64,enhanced-React Tutorial');
    });
  });

  describe('initialization check', () => {
    it('should throw error when AI service is not initialized', async () => {
      await expect(useCase.execute(validParams)).rejects.toThrow('AI service not initialized. Please set your API key.');
    });

    it('should proceed when AI service is initialized', async () => {
      repository.initialize('test-api-key');

      const result = await useCase.execute(validParams);

      expect(result).toBe('data:image/png;base64,enhanced-React Tutorial');
    });
  });

  describe('enhancement execution', () => {
    beforeEach(() => {
      repository.initialize('test-api-key');
    });

    it('should enhance thumbnail with valid parameters', async () => {
      const result = await useCase.execute(validParams);

      expect(result).toBe('data:image/png;base64,enhanced-React Tutorial');
    });

    it('should handle lucky mode correctly', async () => {
      const luckyParams = { ...validParams, isLucky: true, userPrompt: undefined };

      const result = await useCase.execute(luckyParams);

      expect(result).toBe('data:image/png;base64,enhanced-React Tutorial');
    });

    it('should propagate errors from repository', async () => {
      fakeDataSource.setShouldThrowError(true);

      await expect(useCase.execute(validParams)).rejects.toThrow('AI service error');
    });
  });
});