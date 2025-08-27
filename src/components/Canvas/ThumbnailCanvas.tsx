import React, { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface ThumbnailCanvasProps {
  canvasRef: React.RefObject<Canvas | null>;
}

const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = ({ canvasRef }) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasElementRef.current) return;

    const canvas = new Canvas(canvasElementRef.current, {
      width: 1280,
      height: 720,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    if (canvasRef && 'current' in canvasRef) {
      (canvasRef as React.MutableRefObject<Canvas | null>).current = canvas;
    }

    const handleResize = () => {
      const container = canvasElementRef.current?.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth - 40;
      const containerHeight = container.clientHeight - 40;
      const scaleX = containerWidth / 1280;
      const scaleY = containerHeight / 720;
      const scale = Math.min(scaleX, scaleY);

      canvas.setDimensions({
        width: 1280 * scale,
        height: 720 * scale,
      });
      canvas.setZoom(scale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [canvasRef]);

  return (
    <div className="bg-white rounded-lg shadow-2xl p-4">
      <canvas ref={canvasElementRef} className="border-2 border-gray-300 rounded" />
    </div>
  );
};

export default ThumbnailCanvas;