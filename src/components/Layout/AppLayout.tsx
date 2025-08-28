import React from 'react';
import ThumbnailCanvas from '../Canvas/ThumbnailCanvas';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';
import Toolbar from '../Toolbar/Toolbar';
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
  onDeleteObject: () => void;
  onCopyObject: () => void;
  onPasteObject: () => void;
  canPaste: boolean;
  onClearCanvas: () => void;
  onAIGenerate: (videoContext: string, prompt: string) => void;
  onLuckyGenerate: (videoContext: string) => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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
  onDeleteObject,
  onCopyObject,
  onPasteObject,
  canPaste,
  onClearCanvas,
  onAIGenerate,
  onLuckyGenerate,
  onDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1">
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
        
        <div className="flex-1 flex flex-col bg-gray-50">
          <Toolbar
            hasSelection={!!selectedObject}
            canPaste={canPaste}
            onCopy={onCopyObject}
            onPaste={onPasteObject}
            onDelete={onDeleteObject}
            onClear={onClearCanvas}
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          <div className="flex-1 flex items-center justify-center p-8">
            <ThumbnailCanvas canvasRef={canvasRef} />
          </div>
        </div>
        
        <div className="w-96 bg-white shadow-lg overflow-y-auto">
          <RightPanel
            onAIGenerate={onAIGenerate}
            onLuckyGenerate={onLuckyGenerate}
            onDownload={onDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;