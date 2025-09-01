export interface GenerateImageParams {
    canvasImage: string;
    videoContext: string;
    userPrompt?: string;
    isLucky?: boolean;
}

export interface IAIRepository {
    /**
     * Enhances a thumbnail image using the AI model.
     * @param params - The parameters for the image generation.
     * @returns A promise that resolves to the base64 data URL of the enhanced image.
     */
    enhance(params: GenerateImageParams): Promise<string>;

    /**
     * Initializes the underlying AI service with the provided API key.
     * @param apiKey - The user's Gemini API key.
     */
    initialize(apiKey: string): void;

    /**
     * Checks if the AI service has been initialized.
     * @returns `true` if the service is ready, otherwise `false`.
     */
    isInitialized(): boolean;
}