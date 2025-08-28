import { Canvas, FabricImage, IText, FabricObject } from 'fabric';
import { loadTextProperties } from './textPropertiesUtils';

export const canvasToBase64 = (canvas: Canvas): string => {
  return canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 1,
  });
};

export const downloadCanvas = (canvas: Canvas, filename: string = 'thumbnail.png') => {
  const dataURL = canvasToBase64(canvas);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const loadImageFromUrl = (url: string): Promise<FabricImage> => {
  return FabricImage.fromURL(url, {
    crossOrigin: 'anonymous'
  });
};

export const addTextToCanvas = (
  canvas: Canvas,
  text: string = 'Your Text Here',
  options?: any
): IText => {
  // Load persistent text properties
  const textProperties = loadTextProperties();
  
  const iText = new IText(text, {
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    originX: 'center',
    originY: 'center',
    textAlign: 'center',
    ...textProperties,
    ...options,
  });
  
  canvas.add(iText);
  canvas.setActiveObject(iText);
  canvas.renderAll();
  
  return iText;
};

export const addImageToCanvas = async (
  canvas: Canvas,
  imageUrl: string
): Promise<FabricImage> => {
  const img = await loadImageFromUrl(imageUrl);
  
  const maxWidth = canvas.width! * 0.8;
  const maxHeight = canvas.height! * 0.8;
  const scale = Math.min(
    maxWidth / img.width!,
    maxHeight / img.height!,
    1
  );
  
  img.set({
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    originX: 'center',
    originY: 'center',
    scaleX: scale,
    scaleY: scale,
  });
  
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.renderAll();
  
  return img;
};

export const replaceCanvasWithImage = async (
  canvas: Canvas,
  imageUrl: string
) => {
  // Validate canvas is properly initialized
  if (!canvas || !canvas.getContext || !canvas.getContext()) {
    throw new Error('Canvas is not properly initialized');
  }

  try {
    // Save the background color before clearing
    const bgColor = canvas.backgroundColor;
    canvas.clear();
    // Restore the background color
    canvas.backgroundColor = bgColor;
  } catch (error) {
    console.error('Error clearing canvas in replaceCanvasWithImage:', error);
    throw new Error('Failed to clear canvas for image replacement');
  }
  
  const img = await loadImageFromUrl(imageUrl);
  
  // Use the original canvas dimensions (1280x720), not the scaled display size
  const originalWidth = 1280;
  const originalHeight = 720;
  
  img.set({
    left: 0,
    top: 0,
    scaleX: originalWidth / img.width!,
    scaleY: originalHeight / img.height!,
    selectable: true,
    evented: true,
  });
  
  canvas.add(img);
  canvas.renderAll();
};

export const saveCanvasState = (canvas: Canvas): void => {
  try {
    const canvasData = {
      objects: canvas.toJSON(),
      backgroundColor: canvas.backgroundColor,
      timestamp: Date.now(),
    };
    localStorage.setItem('thumbnail_pro_canvas', JSON.stringify(canvasData));
  } catch (error) {
    console.warn('Failed to save canvas state to localStorage:', error);
  }
};

export const loadCanvasState = (canvas: Canvas): boolean => {
  try {
    const savedData = localStorage.getItem('thumbnail_pro_canvas');
    if (!savedData) return false;
    
    const canvasData = JSON.parse(savedData);
    if (!canvasData.objects) return false;
    
    // Load the canvas data
    canvas.loadFromJSON(canvasData.objects).then(() => {
      // Restore background color if saved
      if (canvasData.backgroundColor) {
        canvas.backgroundColor = canvasData.backgroundColor;
      }
      canvas.renderAll();
    });
    
    return true;
  } catch (error) {
    console.warn('Failed to load canvas state from localStorage:', error);
    return false;
  }
};