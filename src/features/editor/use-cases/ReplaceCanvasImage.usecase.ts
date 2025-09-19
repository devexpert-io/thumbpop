import { Canvas } from 'fabric';
import { IEditorRepository } from '../types';

export const createReplaceCanvasImageUseCase = (editorRepository: IEditorRepository) => ({
    async execute(canvas: Canvas, imageUrl: string): Promise<void> {
        if (!canvas) {
            throw new Error('Canvas is not available');
        }

        const canvasElement = canvas.getElement();
        if (!canvasElement || !canvasElement.getContext || !canvasElement.getContext('2d')) {
            throw new Error('Canvas context is not available');
        }

        if (!canvas.contextContainer || !canvas.contextTop) {
            throw new Error('Fabric canvas contexts are not initialized');
        }

        const backgroundColor = canvas.backgroundColor;

        const objects = canvas.getObjects();
        objects.forEach((object) => canvas.remove(object));
        canvas.discardActiveObject();
        canvas.backgroundColor = backgroundColor;
        canvas.renderAll();

        const img = await editorRepository.loadImage(imageUrl);
        const zoom = canvas.getZoom();
        canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);

        const originalWidth = canvas.width ?? 1280;
        const originalHeight = canvas.height ?? 720;

        img.set({
            left: 0,
            top: 0,
            scaleX: originalWidth / img.width!,
            scaleY: originalHeight / img.height!,
            selectable: true,
            evented: true,
        });

        canvas.add(img);
        canvas.renderAll();
    },
});
