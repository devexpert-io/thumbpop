import { Canvas, IText } from 'fabric';
import { IEditorRepository } from '../types';

export interface AddTextParams {
    text?: string;
    options?: Record<string, unknown>;
}

export const createAddTextUseCase = (editorRepository: IEditorRepository) => ({
    execute(canvas: Canvas, params: AddTextParams = {}): IText {
        const { text = 'Your Text Here', options = {} } = params;
        const textProperties = editorRepository.loadTextProperties();

        const iText = new IText(text, {
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            originX: 'center',
            originY: 'center',
            textAlign: 'center',
            ...textProperties,
            ...options,
        });

        canvas.add(iText);
        canvas.setActiveObject(iText);
        canvas.renderAll();

        return iText;
    },
});
