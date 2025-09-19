import { useCallback, useState } from 'react';
import { GenerateImageParams } from '../types';
import { useServices } from '../../../core/di/ServicesContext';

export function useAIGeneration() {
    const {
        aiRepository,
        enhanceThumbnailUseCase,
        getStoredApiKeyUseCase,
        saveApiKeyUseCase,
    } = useServices();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const initialize = useCallback(
        (apiKey: string) => {
            saveApiKeyUseCase.execute(apiKey);
            aiRepository.initialize(apiKey);
        },
        [aiRepository, saveApiKeyUseCase]
    );

    const initializeFromStorage = useCallback((): boolean => {
        const storedKey = getStoredApiKeyUseCase.execute();
        if (!storedKey) {
            return false;
        }
        aiRepository.initialize(storedKey);
        return true;
    }, [aiRepository, getStoredApiKeyUseCase]);

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
        initializeFromStorage,
    };
}
