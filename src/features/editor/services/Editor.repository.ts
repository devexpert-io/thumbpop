import {
    ICanvasStateDataSource,
    IEditorRepository,
    IImageDataSource,
    ITextPropertiesDataSource,
    CanvasStateData,
    TextProperties,
} from '../types';

interface EditorRepositoryDependencies {
    canvasStateDataSource: ICanvasStateDataSource;
    textPropertiesDataSource: ITextPropertiesDataSource;
    imageDataSource: IImageDataSource;
}

export const createEditorRepository = ({
    canvasStateDataSource,
    textPropertiesDataSource,
    imageDataSource,
}: EditorRepositoryDependencies): IEditorRepository => ({
    async saveCanvasState(state: CanvasStateData): Promise<void> {
        await canvasStateDataSource.save(state);
    },

    async loadCanvasState(): Promise<CanvasStateData | null> {
        return canvasStateDataSource.load();
    },

    async clearCanvasState(): Promise<void> {
        await canvasStateDataSource.clear();
    },

    loadTextProperties(): TextProperties {
        return textPropertiesDataSource.load();
    },

    saveTextProperties(properties: Partial<TextProperties>): void {
        textPropertiesDataSource.save(properties);
    },

    async loadImage(imageUrl: string) {
        return imageDataSource.load(imageUrl);
    },
});
