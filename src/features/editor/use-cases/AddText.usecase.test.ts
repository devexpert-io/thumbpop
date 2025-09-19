jest.mock('fabric', () => {
    class MockIText {
        text: string;
        options: Record<string, unknown>;
        constructor(text: string, options: Record<string, unknown>) {
            this.text = text;
            this.options = options;
        }
    }

    return {
        IText: MockIText,
    };
});

import { createAddTextUseCase } from './AddText.usecase';
import { IEditorRepository } from '../types';
import { IText } from 'fabric';

describe('AddTextUseCase', () => {
    const repository: jest.Mocked<IEditorRepository> = {
        saveCanvasState: jest.fn(),
        loadCanvasState: jest.fn(),
        clearCanvasState: jest.fn(),
        loadTextProperties: jest.fn(),
        saveTextProperties: jest.fn(),
        loadImage: jest.fn(),
    } as any;

    const useCase = createAddTextUseCase(repository);

    beforeEach(() => {
        repository.loadTextProperties.mockReturnValue({
            fontFamily: 'Impact',
            fontSize: 48,
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2,
            angle: 0,
        });
    });

    it('creates text object centered on canvas', () => {
        const canvas = {
            width: 1280,
            height: 720,
            add: jest.fn(),
            setActiveObject: jest.fn(),
            renderAll: jest.fn(),
        } as any;

        const result = useCase.execute(canvas);

        expect(repository.loadTextProperties).toHaveBeenCalled();
        expect(canvas.add).toHaveBeenCalled();
        expect(canvas.setActiveObject).toHaveBeenCalledWith(result);
        expect(canvas.renderAll).toHaveBeenCalled();
        expect(result).toBeInstanceOf(IText);
    });
});
