import { useCallback, useState } from 'react';
import { GenerateImageParams } from '../types';
import { useServices } from '../../../core/di/ServicesContext';

export function useAIGeneration() {
    const { aiRepository, enhanceThumbnailUseCase } = useServices();
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
            setIsLoading(true);
            setError(null);

            try {
                return await enhanceThumbnailUseCase.execute(params);
            } catch (err: any) {
                setError(err);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [enhanceThumbnailUseCase]
    );

    return {
        isLoading,
        error,
        enhance,
        initialize,
    };
}
