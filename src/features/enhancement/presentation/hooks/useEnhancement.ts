import { useCallback } from 'react';
import { useDI } from '../../../../shared/infrastructure/di/DIContext';
import { EnhancementParams } from '../../data/repositories/EnhancementRepository';

export interface UseEnhancementResult {
  enhance: (params: EnhancementParams) => Promise<string>;
  initialize: (apiKey: string) => void;
  isInitialized: () => boolean;
}

export const useEnhancement = (): UseEnhancementResult => {
  const { enhanceThumbnailUseCase, enhancementRepository } = useDI();

  const enhance = useCallback(
    (params: EnhancementParams) => {
      return enhanceThumbnailUseCase.execute(params);
    },
    [enhanceThumbnailUseCase]
  );

  const initialize = useCallback(
    (apiKey: string) => {
      enhancementRepository.initialize(apiKey);
    },
    [enhancementRepository]
  );

  const isInitialized = useCallback(() => {
    return enhancementRepository.isInitialized();
  }, [enhancementRepository]);

  return {
    enhance,
    initialize,
    isInitialized,
  };
};