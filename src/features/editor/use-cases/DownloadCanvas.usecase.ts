import { Canvas } from 'fabric';
import { DownloadOptions } from '../types';

export const createDownloadCanvasUseCase = () => ({
    execute(canvas: Canvas, options: DownloadOptions = {}): void {
        const { filename = 'thumbnail.png' } = options;
        const currentZoom = canvas.getZoom();
        const multiplier = 1 / currentZoom;

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier,
        });

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
});
