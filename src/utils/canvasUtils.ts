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
  // More comprehensive canvas validation
  if (!canvas) {
    throw new Error('Canvas is null or undefined');
  }

  // Check if canvas has proper context and DOM element
  const canvasEl = canvas.getElement();
  if (!canvasEl || !canvasEl.getContext || !canvasEl.getContext('2d')) {
    throw new Error('Canvas context is not available');
  }

  // Check if Fabric canvas is properly initialized
  if (!canvas.contextContainer || !canvas.contextTop) {
    throw new Error('Fabric canvas contexts are not initialized');
  }

  try {
    // Save the background color before clearing
    const bgColor = canvas.backgroundColor;
    
    // Use a safer clearing method: remove all objects instead of clear()
    const objects = canvas.getObjects();
    objects.forEach(obj => canvas.remove(obj));
    canvas.discardActiveObject();
    
    // Restore the background color
    canvas.backgroundColor = bgColor;
    canvas.renderAll();
  } catch (error) {
    console.error('Error clearing canvas in replaceCanvasWithImage:', error);
    throw new Error('Failed to clear canvas for image replacement');
  }
  
  const img = await loadImageFromUrl(imageUrl);
  
  // Reset canvas panning but preserve zoom
  const zoom = canvas.getZoom();
  canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  
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
    localStorage.setItem('thumbpop_canvas', JSON.stringify(canvasData));
  } catch (error) {
    console.warn('Failed to save canvas state to localStorage:', error);
  }
};

export const loadCanvasState = (canvas: Canvas): boolean => {
  try {
    // Check if canvas is fully initialized before proceeding
    if (!canvas || !canvas.getElement || !canvas.contextContainer || !canvas.contextTop) {
      console.warn('Canvas not fully initialized, delaying state load');
      return false;
    }

    const canvasEl = canvas.getElement();
    if (!canvasEl || !canvasEl.getContext || !canvasEl.getContext('2d')) {
      console.warn('Canvas context not ready, delaying state load');
      return false;
    }

    const savedData = localStorage.getItem('thumbpop_canvas');
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
    }).catch((error) => {
      console.warn('Failed to load canvas from JSON:', error);
    });
    
    return true;
  } catch (error) {
    console.warn('Failed to load canvas state from localStorage:', error);
    return false;
  }
};