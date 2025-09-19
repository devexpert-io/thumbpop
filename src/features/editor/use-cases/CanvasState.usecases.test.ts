import { createSaveCanvasStateUseCase } from './SaveCanvasState.usecase';
import { createLoadCanvasStateUseCase } from './LoadCanvasState.usecase';
import { createClearCanvasStateUseCase } from './ClearCanvasState.usecase';
import { IEditorRepository } from '../types';

describe('Canvas state use cases', () => {
    const repository: jest.Mocked<IEditorRepository> = {
        saveCanvasState: jest.fn(),
        loadCanvasState: jest.fn(),
        clearCanvasState: jest.fn(),
        loadTextProperties: jest.fn(),
        saveTextProperties: jest.fn(),
        loadImage: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('saves canvas state', async () => {
        const canvas = {
            toJSON: jest.fn(() => ({ objects: [] })),
            backgroundColor: '#fff',
        } as any;

        const useCase = createSaveCanvasStateUseCase(repository);
        await useCase.execute(canvas);

        expect(repository.saveCanvasState).toHaveBeenCalledWith({
            objects: { objects: [] },
            backgroundColor: '#fff',
        });
    });

    it('loads canvas state when canvas ready', async () => {
        repository.loadCanvasState.mockResolvedValue({ objects: { foo: 'bar' }, backgroundColor: '#123456' });
        const canvas = {
            getElement: jest.fn(() => ({ getContext: jest.fn(() => ({})) })),
            contextContainer: {},
            contextTop: {},
            loadFromJSON: jest.fn(() => Promise.resolve()),
            renderAll: jest.fn(),
            backgroundColor: '#000000',
        } as any;

        const useCase = createLoadCanvasStateUseCase(repository);
        const loaded = await useCase.execute(canvas);

        expect(loaded).toBe(true);
        expect(canvas.loadFromJSON).toHaveBeenCalledWith({ foo: 'bar' });
        expect(canvas.renderAll).toHaveBeenCalled();
        expect(canvas.backgroundColor).toBe('#123456');
    });

    it('returns false when canvas not ready', async () => {
        const canvas = {
            getElement: jest.fn(() => null),
        } as any;
        const useCase = createLoadCanvasStateUseCase(repository);
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const loaded = await useCase.execute(canvas);
        warnSpy.mockRestore();
        expect(loaded).toBe(false);
    });

    it('clears canvas state via repository', async () => {
        const useCase = createClearCanvasStateUseCase(repository);
        await useCase.execute();
        expect(repository.clearCanvasState).toHaveBeenCalled();
    });
});
