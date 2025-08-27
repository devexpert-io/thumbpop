import { Canvas, FabricImage, IText, FabricObject } from 'fabric';

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
  const iText = new IText(text, {
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    fontFamily: 'Impact',
    fontSize: 48,
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    textAlign: 'center',
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
  canvas.clear();
  
  const img = await loadImageFromUrl(imageUrl);
  
  img.set({
    left: 0,
    top: 0,
    scaleX: canvas.width! / img.width!,
    scaleY: canvas.height! / img.height!,
    selectable: false,
    evented: false,
  });
  
  canvas.add(img);
  canvas.renderAll();
};