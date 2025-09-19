import { Canvas, FabricImage } from 'fabric';
import { IEditorRepository } from '../types';

export const createAddImageUseCase = (editorRepository: IEditorRepository) => ({
    async execute(canvas: Canvas, imageUrl: string): Promise<FabricImage> {
        const img = await editorRepository.loadImage(imageUrl);

        const maxWidth = canvas.width! * 0.8;
        const maxHeight = canvas.height! * 0.8;
        const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!, 1);

        img.set({
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();

        return img;
    },
});
