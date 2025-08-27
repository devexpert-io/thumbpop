import React from 'react';
import ThumbnailCanvas from '../Canvas/ThumbnailCanvas';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';
import { FabricObject } from 'fabric';

interface AppLayoutProps {
  canvasRef: React.RefObject<any>;
  selectedObject: FabricObject | null;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onAddText: () => void;
  onUpdateText: (options: any) => void;
  onImageUpload: (file: File) => void;
  onRemoveBackground: () => void;
  onAIGenerate: (videoContext: string, prompt: string) => void;
  onLuckyGenerate: (videoContext: string) => void;
  onDownload: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  canvasRef,
  selectedObject,
  backgroundColor,
  onBackgroundColorChange,
  onAddText,
  onUpdateText,
  onImageUpload,
  onRemoveBackground,
  onAIGenerate,
  onLuckyGenerate,
  onDownload,
}) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <LeftPanel
          selectedObject={selectedObject}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={onBackgroundColorChange}
          onAddText={onAddText}
          onUpdateText={onUpdateText}
          onImageUpload={onImageUpload}
          onRemoveBackground={onRemoveBackground}
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <ThumbnailCanvas canvasRef={canvasRef} />
      </div>
      
      <div className="w-96 bg-white shadow-lg overflow-y-auto">
        <RightPanel
          onAIGenerate={onAIGenerate}
          onLuckyGenerate={onLuckyGenerate}
          onDownload={onDownload}
        />
      </div>
    </div>
  );
};

export default AppLayout;