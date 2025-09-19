import { useCallback, useEffect, useState } from 'react';
import { useServices } from '../../../core/di/ServicesContext';

export function useAIPrompt() {
    const { getVideoContextUseCase, saveVideoContextUseCase } = useServices();
    const [videoContext, setVideoContext] = useState('');

    useEffect(() => {
        const saved = getVideoContextUseCase.execute();
        if (saved) {
            setVideoContext(saved);
        }
    }, [getVideoContextUseCase]);

    const updateVideoContext = useCallback(
        (value: string) => {
            setVideoContext(value);
            saveVideoContextUseCase.execute(value);
        },
        [saveVideoContextUseCase]
    );

    return {
        videoContext,
        setVideoContext: updateVideoContext,
    };
}
