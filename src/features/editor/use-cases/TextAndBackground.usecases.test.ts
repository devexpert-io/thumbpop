import { createRemoveBackgroundUseCase } from './RemoveBackground.usecase';
import { createLoadTextPropertiesUseCase } from './LoadTextProperties.usecase';
import { createSaveTextPropertiesUseCase } from './SaveTextProperties.usecase';
import { IEditorRepository } from '../types';

describe('Editor utility use cases', () => {
    const repository: jest.Mocked<IEditorRepository> = {
        saveCanvasState: jest.fn(),
        loadCanvasState: jest.fn(),
        clearCanvasState: jest.fn(),
        loadTextProperties: jest.fn(),
        saveTextProperties: jest.fn(),
        removeBackground: jest.fn(),
        loadImage: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('delegates background removal to repository', async () => {
        repository.removeBackground.mockResolvedValue('processed');
        const useCase = createRemoveBackgroundUseCase(repository);
        const result = await useCase.execute('image');
        expect(result).toBe('processed');
        expect(repository.removeBackground).toHaveBeenCalledWith('image');
    });

    it('loads text properties from repository', () => {
        repository.loadTextProperties.mockReturnValue({
            fontFamily: 'Impact',
            fontSize: 48,
            fill: '#fff',
            stroke: '#000',
            strokeWidth: 2,
            angle: 0,
        });
        const useCase = createLoadTextPropertiesUseCase(repository);
        const result = useCase.execute();
        expect(result.fontFamily).toBe('Impact');
    });

    it('saves text properties via repository', () => {
        const useCase = createSaveTextPropertiesUseCase(repository);
        useCase.execute({ fontFamily: 'Arial' });
        expect(repository.saveTextProperties).toHaveBeenCalledWith({ fontFamily: 'Arial' });
    });
});
