import {GenerateImageParams, IAIDataSource, IAIRepository} from "../types";

export const createAIRepository = (aiDataSource: IAIDataSource): IAIRepository => ({
    async enhance(params: GenerateImageParams): Promise<string> {
        return aiDataSource.enhance(params);
    },

    initialize(apiKey: string): void {
        aiDataSource.initialize(apiKey);
    },

    isInitialized(): boolean {
        return aiDataSource.isInitialized();
    }
})