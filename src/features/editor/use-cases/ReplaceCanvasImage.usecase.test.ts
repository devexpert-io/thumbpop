import { createReplaceCanvasImageUseCase } from './ReplaceCanvasImage.usecase';
import { IEditorRepository } from '../types';

describe('ReplaceCanvasImageUseCase', () => {
    const repository: jest.Mocked<IEditorRepository> = {
        saveCanvasState: jest.fn(),
        loadCanvasState: jest.fn(),
        clearCanvasState: jest.fn(),
        loadTextProperties: jest.fn(),
        saveTextProperties: jest.fn(),
        loadImage: jest.fn(),
    } as any;

    const useCase = createReplaceCanvasImageUseCase(repository);

    it('replaces existing canvas objects with new image', async () => {
        const image = { set: jest.fn(), width: 640, height: 360 } as any;
        repository.loadImage.mockResolvedValue(image);

        const existingObject = { id: 'old' };
        const canvas = {
            getElement: jest.fn(() => ({ getContext: jest.fn(() => ({})) })),
            contextContainer: {},
            contextTop: {},
            getObjects: jest.fn(() => [existingObject]),
            remove: jest.fn(),
            discardActiveObject: jest.fn(),
            backgroundColor: '#123456',
            renderAll: jest.fn(),
            getZoom: jest.fn(() => 1),
            setViewportTransform: jest.fn(),
            width: 1280,
            height: 720,
            add: jest.fn(),
        } as any;

        await useCase.execute(canvas, 'image-url');

        expect(canvas.remove).toHaveBeenCalledWith(existingObject);
        expect(repository.loadImage).toHaveBeenCalledWith('image-url');
        expect(image.set).toHaveBeenCalled();
        expect(canvas.add).toHaveBeenCalledWith(image);
        expect(canvas.renderAll).toHaveBeenCalled();
    });
});
