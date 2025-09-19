import { Canvas } from 'fabric';

export const createCanvasToBase64UseCase = () => ({
    execute(canvas: Canvas): string {
        const currentZoom = canvas.getZoom();
        const multiplier = 1 / currentZoom;

        return canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier,
        });
    },
});
