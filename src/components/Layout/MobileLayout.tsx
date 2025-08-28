import React, { useState } from 'react';
import { FabricObject } from 'fabric';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';
import Toolbar from '../Toolbar/Toolbar';

interface MobileLayoutProps {
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
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
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
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'tools' | 'ai'>('canvas');

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'canvas' && (
          <div className="h-full flex flex-col">
            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-2">
              <div className="bg-white rounded-lg shadow-2xl p-2 w-full max-w-full">
                <canvas 
                  ref={canvasRef} 
                  className="border-2 border-gray-300 rounded w-full max-w-full"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="h-full overflow-y-auto">
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
        )}

        {activeTab === 'ai' && (
          <div className="h-full overflow-y-auto">
            <RightPanel
              onAIGenerate={onAIGenerate}
              onLuckyGenerate={onLuckyGenerate}
              onDownload={onDownload}
              showToast={showToast}
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-center ${activeTab === 'canvas' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('canvas')}
          >
            Canvas
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${activeTab === 'tools' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('tools')}
          >
            Tools
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${activeTab === 'ai' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
            onClick={() => setActiveTab('ai')}
          >
            AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;