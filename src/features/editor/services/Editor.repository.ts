import {
    IBackgroundRemovalDataSource,
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
    backgroundRemovalDataSource: IBackgroundRemovalDataSource;
    imageDataSource: IImageDataSource;
}

export const createEditorRepository = ({
    canvasStateDataSource,
    textPropertiesDataSource,
    backgroundRemovalDataSource,
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

    async removeBackground(imageUrl: string): Promise<string> {
        return backgroundRemovalDataSource.removeBackground(imageUrl);
    },

    async loadImage(imageUrl: string) {
        return imageDataSource.load(imageUrl);
    },
});
