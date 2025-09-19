import { IEditorRepository } from '../types';

export const createClearCanvasStateUseCase = (editorRepository: IEditorRepository) => ({
    async execute(): Promise<void> {
        await editorRepository.clearCanvasState();
    },
});
