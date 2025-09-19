import { createEditorRepository } from './Editor.repository';
import { ICanvasStateDataSource, IImageDataSource, ITextPropertiesDataSource } from '../types';

const canvasStateDataSource: jest.Mocked<ICanvasStateDataSource> = {
    save: jest.fn(),
    load: jest.fn(),
    clear: jest.fn(),
};

const textPropertiesDataSource: jest.Mocked<ITextPropertiesDataSource> = {
    load: jest.fn(),
    save: jest.fn(),
};

const imageDataSource: jest.Mocked<IImageDataSource> = {
    load: jest.fn(),
};

const repository = createEditorRepository({
    canvasStateDataSource,
    textPropertiesDataSource,
    imageDataSource,
});

describe('EditorRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('saves and loads canvas state through data source', async () => {
        canvasStateDataSource.load.mockResolvedValue({ objects: {}, backgroundColor: '#fff' });
        await repository.saveCanvasState({ objects: {}, backgroundColor: '#000' });
        const state = await repository.loadCanvasState();

        expect(canvasStateDataSource.save).toHaveBeenCalledWith({ objects: {}, backgroundColor: '#000' });
        expect(canvasStateDataSource.load).toHaveBeenCalled();
        expect(state).toEqual({ objects: {}, backgroundColor: '#fff' });
    });

    it('clears canvas state', async () => {
        await repository.clearCanvasState();
        expect(canvasStateDataSource.clear).toHaveBeenCalled();
    });

    it('loads and saves text properties', () => {
        textPropertiesDataSource.load.mockReturnValue({
            fontFamily: 'Impact',
            fontSize: 48,
            fill: '#fff',
            stroke: '#000',
            strokeWidth: 2,
            angle: 0,
        });

        const properties = repository.loadTextProperties();
        expect(properties.fontFamily).toBe('Impact');

        repository.saveTextProperties({ fontFamily: 'Arial' });
        expect(textPropertiesDataSource.save).toHaveBeenCalledWith({ fontFamily: 'Arial' });
    });

    it('loads image from data source', async () => {
        const mockImage = { id: 'image' } as any;
        imageDataSource.load.mockResolvedValue(mockImage);
        const result = await repository.loadImage('url');
        expect(result).toBe(mockImage);
        expect(imageDataSource.load).toHaveBeenCalledWith('url');
    });
});
