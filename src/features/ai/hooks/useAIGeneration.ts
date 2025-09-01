import { useState, useCallback } from 'react';
import { enhanceThumbnailUseCase } from '../use-cases/EnhanceThumbnail.usecase';
import { GenerateImageParams } from '../types';
import {useServices} from "../../../core/di/ServicesContext";

export function useAIGeneration() {
    const { aiRepository } = useServices();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const initialize = useCallback(
        (apiKey: string) => {
            aiRepository.initialize(apiKey);
        },
        [aiRepository]
    );

    const enhance = useCallback(
        async (params: GenerateImageParams): Promise<string> => {
            if (!aiRepository.isInitialized()) {
                const err = new Error('AI service not initialized. Please set your API key.');
                setError(err);
                throw err;
            }

            setIsLoading(true);
            setError(null);

            try {
                const result = await enhanceThumbnailUseCase.execute(params);
                return result;
            } catch (err: any) {
                setError(err);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [aiRepository]
    );

    return {
        isLoading,
        error,
        enhance,
        initialize,
    };
}