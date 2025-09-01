import {geminiAIDataSource} from './data-sources/Gemini.datasource';
import {GenerateImageParams, IAIRepository} from "../types";

export const aiRepository: IAIRepository = {
    async enhance(params: GenerateImageParams): Promise<string> {
        return geminiAIDataSource.generateImage(params);
    },

    initialize(apiKey: string): void {
        geminiAIDataSource.initialize(apiKey);
    },

    isInitialized(): boolean {
        return geminiAIDataSource.isInitialized();
    },
};