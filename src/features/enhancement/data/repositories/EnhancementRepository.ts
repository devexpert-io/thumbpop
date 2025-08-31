import { AIDataSource, GenerateImageParams } from '../data-sources/AIDataSource';

export interface EnhancementParams {
  canvasImage: string;
  videoContext: string;
  userPrompt?: string;
  isLucky?: boolean;
}

export class EnhancementRepository {
  constructor(private aiDataSource: AIDataSource) {}

  async enhance(params: EnhancementParams): Promise<string> {
    // Convert domain params to data source params
    const generateParams: GenerateImageParams = {
      canvasImage: params.canvasImage,
      videoContext: params.videoContext,
      userPrompt: params.userPrompt,
      isLucky: params.isLucky,
    };

    return this.aiDataSource.generateImage(generateParams);
  }

  initialize(apiKey: string): void {
    this.aiDataSource.initialize(apiKey);
  }

  isInitialized(): boolean {
    return this.aiDataSource.isInitialized();
  }
}