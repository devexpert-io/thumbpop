import React, { useRef, useState, useEffect } from 'react';
import { Upload, Scissors, RotateCw } from 'lucide-react';
import { FabricObject } from 'fabric';

interface ImageSectionProps {
  selectedObject: FabricObject | null;
  onImageUpload: (file: File) => void;
  onRemoveBackground: () => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  selectedObject,
  onImageUpload,
  onRemoveBackground,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  useEffect(() => {
    if (selectedObject && (selectedObject.type === 'image' || selectedObject.type === 'Image')) {
      setRotation(selectedObject.angle || 0);
      setOpacity((selectedObject.opacity || 1) * 100);
    }
  }, [selectedObject]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleRotationChange = (value: number) => {
    if (selectedObject && (selectedObject.type === 'image' || selectedObject.type === 'Image')) {
      setRotation(value);
      selectedObject.set('angle', value);
      selectedObject.canvas?.renderAll();
    }
  };

  const handleOpacityChange = (value: number) => {
    if (selectedObject && (selectedObject.type === 'image' || selectedObject.type === 'Image')) {
      setOpacity(value);
      selectedObject.set('opacity', value / 100);
      selectedObject.canvas?.renderAll();
    }
  };

  const isImageSelected = selectedObject && (selectedObject.type === 'image' || selectedObject.type === 'Image' || (selectedObject as any).isType?.('Image'));
  
  console.log('ImageSection - selectedObject type:', selectedObject?.type, 'isImageSelected:', isImageSelected);

  return (
    <div className="space-y-4">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
      >
        <Upload size={20} />
        <span>Upload Image</span>
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />

      {isImageSelected && (
        <>
          <button
            onClick={async () => {
              setIsRemovingBg(true);
              try {
                await onRemoveBackground();
              } finally {
                setIsRemovingBg(false);
              }
            }}
            disabled={isRemovingBg}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRemovingBg ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Scissors size={20} />
                <span>Remove Background</span>
              </>
            )}
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <RotateCw size={16} className="inline mr-2" />
              Rotation: {rotation}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={rotation}
              onChange={(e) => handleRotationChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity: {opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-1">Tips:</p>
            <ul className="space-y-1">
              <li>• Drag corners to resize</li>
              <li>• Drag to move position</li>
              <li>• Use Remove Background for transparent PNGs</li>
              <li>• First background removal loads AI model (~10-20s)</li>
              <li>• Subsequent removals are much faster (~2-5s)</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSection;