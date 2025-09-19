import { createDownloadCanvasUseCase } from './DownloadCanvas.usecase';

describe('DownloadCanvasUseCase', () => {
    it('creates anchor and triggers download', () => {
        const canvas = {
            getZoom: jest.fn(() => 1),
            toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
        } as any;

        const link = {
            click: jest.fn(),
            set download(value: string) {
                this._download = value;
            },
            set href(value: string) {
                this._href = value;
            },
        } as any;

        const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link);
        const appendSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => link);
        const removeSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => link);

        const useCase = createDownloadCanvasUseCase();
        useCase.execute(canvas, { filename: 'custom.png' });

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(canvas.toDataURL).toHaveBeenCalled();
        expect(link.click).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalled();

        createElementSpy.mockRestore();
        appendSpy.mockRestore();
        removeSpy.mockRestore();
    });
});
