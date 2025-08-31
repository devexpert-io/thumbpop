import { EnhancementRepository } from './EnhancementRepository';
import { AIDataSource, GenerateImageParams } from '../data-sources/AIDataSource';

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
      throw new Error('Fake AI error');
    }
    return `data:image/png;base64,mock-base64-data-for-${params.videoContext}`;
  }

  setShouldThrowError(shouldThrow: boolean) {
    this.shouldThrowError = shouldThrow;
  }
}

describe('EnhancementRepository', () => {
  let fakeDataSource: FakeAIDataSource;
  let repository: EnhancementRepository;

  beforeEach(() => {
    fakeDataSource = new FakeAIDataSource();
    repository = new EnhancementRepository(fakeDataSource);
  });

  describe('initialize', () => {
    it('should initialize the data source with API key', () => {
      const apiKey = 'test-api-key';
      
      repository.initialize(apiKey);
      
      expect(repository.isInitialized()).toBe(true);
    });

    it('should not be initialized with empty API key', () => {
      repository.initialize('');
      
      expect(repository.isInitialized()).toBe(false);
    });
  });

  describe('enhance', () => {
    const validParams = {
      canvasImage: 'data:image/png;base64,test-image',
      videoContext: 'Tutorial about React',
      userPrompt: 'Make it colorful',
      isLucky: false,
    };

    beforeEach(() => {
      repository.initialize('test-api-key');
    });

    it('should enhance thumbnail with valid parameters', async () => {
      const result = await repository.enhance(validParams);
      
      expect(result).toBe('data:image/png;base64,mock-base64-data-for-Tutorial about React');
    });

    it('should handle lucky mode parameters', async () => {
      const luckyParams = {
        ...validParams,
        isLucky: true,
        userPrompt: undefined,
      };
      
      const result = await repository.enhance(luckyParams);
      
      expect(result).toBe('data:image/png;base64,mock-base64-data-for-Tutorial about React');
    });

    it('should propagate errors from data source', async () => {
      fakeDataSource.setShouldThrowError(true);
      
      await expect(repository.enhance(validParams)).rejects.toThrow('Fake AI error');
    });
  });

  describe('isInitialized', () => {
    it('should return false when not initialized', () => {
      expect(repository.isInitialized()).toBe(false);
    });

    it('should return true when initialized', () => {
      repository.initialize('test-api-key');
      
      expect(repository.isInitialized()).toBe(true);
    });
  });
});