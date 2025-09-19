import { createAddImageUseCase } from './AddImage.usecase';
import { IEditorRepository } from '../types';

describe('AddImageUseCase', () => {
    const repository: jest.Mocked<IEditorRepository> = {
        saveCanvasState: jest.fn(),
        loadCanvasState: jest.fn(),
        clearCanvasState: jest.fn(),
        loadTextProperties: jest.fn(),
        saveTextProperties: jest.fn(),
        removeBackground: jest.fn(),
        loadImage: jest.fn(),
    } as any;

    const useCase = createAddImageUseCase(repository);

    it('adds loaded image to canvas and centers it', async () => {
        const image = {
            width: 640,
            height: 360,
            set: jest.fn(),
        } as any;
        repository.loadImage.mockResolvedValue(image);

        const canvas = {
            width: 1280,
            height: 720,
            add: jest.fn(),
            setActiveObject: jest.fn(),
            renderAll: jest.fn(),
        } as any;

        const result = await useCase.execute(canvas, 'image-url');

        expect(repository.loadImage).toHaveBeenCalledWith('image-url');
        expect(image.set).toHaveBeenCalled();
        expect(canvas.add).toHaveBeenCalledWith(image);
        expect(canvas.setActiveObject).toHaveBeenCalledWith(image);
        expect(canvas.renderAll).toHaveBeenCalled();
        expect(result).toBe(image);
    });
});
