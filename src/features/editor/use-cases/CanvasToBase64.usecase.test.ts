import { createCanvasToBase64UseCase } from './CanvasToBase64.usecase';

describe('CanvasToBase64UseCase', () => {
    it('generates base64 using original zoom', () => {
        const canvas = {
            getZoom: jest.fn(() => 2),
            toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
        } as any;

        const useCase = createCanvasToBase64UseCase();
        const result = useCase.execute(canvas);

        expect(canvas.toDataURL).toHaveBeenCalledWith({
            format: 'png',
            quality: 1,
            multiplier: 0.5,
        });
        expect(result).toBe('data:image/png;base64,abc');
    });
});
