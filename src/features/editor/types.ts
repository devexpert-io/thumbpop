import { Canvas, FabricImage } from 'fabric';

export interface CanvasStateData {
    objects: unknown;
    backgroundColor?: string | null;
}

export interface TextProperties {
    fontFamily: string;
    fontSize: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    angle: number;
}

export interface ICanvasStateDataSource {
    save(state: CanvasStateData): Promise<void>;
    load(): Promise<CanvasStateData | null>;
    clear(): Promise<void>;
}

export interface ITextPropertiesDataSource {
    load(): TextProperties;
    save(properties: Partial<TextProperties>): void;
}

export interface IImageDataSource {
    load(imageUrl: string): Promise<FabricImage>;
}

export interface IEditorRepository {
    saveCanvasState(state: CanvasStateData): Promise<void>;
    loadCanvasState(): Promise<CanvasStateData | null>;
    clearCanvasState(): Promise<void>;
    loadTextProperties(): TextProperties;
    saveTextProperties(properties: Partial<TextProperties>): void;
    loadImage(imageUrl: string): Promise<FabricImage>;
}

export interface DownloadOptions {
    filename?: string;
}

export interface ReplaceImageOptions {
    preserveBackground?: boolean;
}

export interface AddImageOptions {
    scale?: number;
}

export interface CanvasLike extends Pick<Canvas, 'width' | 'height' | 'add' | 'renderAll' | 'setActiveObject' | 'getObjects' | 'discardActiveObject' | 'backgroundColor' | 'loadFromJSON' | 'getZoom' | 'toDataURL' | 'setViewportTransform' | 'getElement' | 'contextContainer' | 'contextTop'> {
    remove(object: any): void;
}
