import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';

interface ThumbnailCanvasProps {
  canvasRef: React.RefObject<Canvas | null>;
  onDrop?: (files: File[]) => void;
}

const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = ({ canvasRef, onDrop }) => {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!canvasElementRef.current) return;

    // Initialize canvas only once
    if (!fabricCanvasRef.current) {
      const canvas = new Canvas(canvasElementRef.current, {
        width: 1280,
        height: 720,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      // Set the ref
      if (canvasRef && 'current' in canvasRef) {
        (canvasRef as React.MutableRefObject<Canvas | null>).current = canvas;
      }
    }

    const handleResize = () => {
      if (!canvasElementRef.current || !fabricCanvasRef.current) return;

      // Find the main canvas container by traversing up the DOM
      let container = canvasElementRef.current.parentElement;
      while (container && !container.classList.contains('flex-1')) {
        container = container.parentElement;
      }
      
      if (!container) {
        // Fallback to immediate parent if flex-1 container not found
        container = canvasElementRef.current.parentElement;
      }
      
      if (!container) return;

      // Get available space with padding consideration
      const containerWidth = Math.max(container.clientWidth - 32, 200); // Minimum width
      const containerHeight = Math.max(container.clientHeight - 32, 120); // Minimum height
      
      // Calculate scale while maintaining aspect ratio
      const scaleX = containerWidth / 1280;
      const scaleY = containerHeight / 720;
      const scale = Math.max(Math.min(scaleX, scaleY, 1), 0.1); // Minimum scale of 0.1

      // Set dimensions based on scale
      try {
        fabricCanvasRef.current.setDimensions({
          width: 1280 * scale,
          height: 720 * scale,
        });
        fabricCanvasRef.current.setZoom(scale);
      } catch (error) {
        console.warn('Failed to set canvas dimensions:', error);
      }
    };

    // Debounced resize handler to prevent ResizeObserver errors
    const debouncedHandleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        handleResize();
      }, 100);
    };

    // Use ResizeObserver for better resize detection
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(debouncedHandleResize);
      
      // Find and observe the main canvas container
      let container = canvasElementRef.current.parentElement;
      while (container && !container.classList.contains('flex-1')) {
        container = container.parentElement;
      }
      
      if (container) {
        resizeObserverRef.current.observe(container);
      } else {
        // Fallback to window resize listener if container not found
        window.addEventListener('resize', debouncedHandleResize);
      }
    } else {
      // Fallback to window resize listener
      window.addEventListener('resize', debouncedHandleResize);
    }

    // Initial resize with delay
    const resizeTimer = setTimeout(() => {
      handleResize();
    }, 100);
    
    // Also call resize immediately
    handleResize();

    return () => {
      clearTimeout(resizeTimer);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      } else {
        window.removeEventListener('resize', debouncedHandleResize);
      }
    };
  }, [canvasRef]);

  // Clean up only when component unmounts
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0 && onDrop) {
      onDrop(imageFiles);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${
        isDragging ? 'bg-blue-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <canvas 
        ref={canvasElementRef} 
        className="border-2 border-gray-300 rounded"
        style={{ pointerEvents: 'all' }}
      />
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Drop images here
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailCanvas;