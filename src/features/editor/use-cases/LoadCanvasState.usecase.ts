import { Canvas } from 'fabric';
import { IEditorRepository } from '../types';

const isCanvasSerializable = (value: unknown): value is string | Record<string, unknown> =>
    typeof value === 'string' || (typeof value === 'object' && value !== null);

export const createLoadCanvasStateUseCase = (editorRepository: IEditorRepository) => ({
    async execute(canvas: Canvas): Promise<boolean> {
        const canvasElement = canvas.getElement();
        if (!canvasElement || !canvasElement.getContext || !canvasElement.getContext('2d')) {
            console.warn('Canvas context not ready, delaying state load');
            return false;
        }

        if (!canvas.contextContainer || !canvas.contextTop) {
            console.warn('Canvas contexts not initialized, delaying state load');
            return false;
        }

        const storedState = await editorRepository.loadCanvasState();
        if (!storedState) {
            return false;
        }

        if (!isCanvasSerializable(storedState.objects)) {
            console.warn('Stored canvas state is invalid, skipping load');
            return false;
        }

        await canvas.loadFromJSON(storedState.objects);

        if (storedState.backgroundColor) {
            canvas.backgroundColor = storedState.backgroundColor;
        }

        canvas.renderAll();
        return true;
    },
});
