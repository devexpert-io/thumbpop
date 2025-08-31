export interface GenerateImageParams {
  canvasImage: string;
  videoContext: string;
  userPrompt?: string;
  isLucky?: boolean;
}

export interface AIDataSource {
  initialize(apiKey: string): void;
  generateImage(params: GenerateImageParams): Promise<string>;
  isInitialized(): boolean;
}