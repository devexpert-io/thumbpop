import { Canvas } from 'fabric';
import { IEditorRepository } from '../types';

export const createSaveCanvasStateUseCase = (editorRepository: IEditorRepository) => ({
    async execute(canvas: Canvas): Promise<void> {
        const canvasJSON = canvas.toJSON();
        const state = {
            objects: canvasJSON,
            backgroundColor: canvas.backgroundColor as string | undefined,
        };
        await editorRepository.saveCanvasState(state);
    },
});
