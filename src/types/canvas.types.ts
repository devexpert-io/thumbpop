import { FabricObject } from 'fabric';

export interface CanvasObject extends FabricObject {
  id?: string;
  type: string;
}

export interface TextOptions {
  content: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  angle?: number;
}

export interface ImageOptions {
  url: string;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  opacity?: number;
}

export interface CanvasState {
  backgroundColor: string;
  objects: CanvasObject[];
}

export interface AIPromptData {
  videoContext: string;
  userPrompt: string;
  isLucky?: boolean;
}