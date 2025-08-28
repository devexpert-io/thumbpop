import React, { useState, useEffect } from 'react';
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
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
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
  showToast,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1400);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1400;
      setIsMobile(mobile);
      
      // Auto-close mobile panels when switching to mobile
      if (mobile) {
        setShowLeftPanel(false);
        setShowRightPanel(false);
      } else {
        // Auto-show panels when switching to desktop
        setShowLeftPanel(true);
        setShowRightPanel(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showLeftPanel) setShowLeftPanel(false);
        if (showRightPanel) setShowRightPanel(false);
      }
    };

    if (isMobile && (showLeftPanel || showRightPanel)) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobile, showLeftPanel, showRightPanel]);

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

      {/* Main content area - responsive layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - toggle on desktop, modal on mobile */}
        {!isMobile && showLeftPanel && (
          <div className="w-80 bg-white shadow-lg overflow-y-auto border-r border-gray-200">
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

        {/* Canvas area - always visible */}
        <div className="flex-1 bg-white shadow-2xl m-4 overflow-hidden flex flex-col">
          {/* Desktop panel toggle buttons */}
          {!isMobile && (
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowLeftPanel(!showLeftPanel)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  showLeftPanel
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🛠️ Tools
              </button>
              <div className="text-sm text-gray-500 font-medium">
                Thumbnail Editor
              </div>
              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  showRightPanel
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ✨ AI
              </button>
            </div>
          )}
          
          {/* Canvas container */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <ThumbnailCanvas canvasRef={canvasRef} />
          </div>
        </div>

        {/* Right Panel - toggle on desktop, modal on mobile */}
        {!isMobile && showRightPanel && (
          <div className="w-96 bg-white shadow-lg overflow-y-auto border-l border-gray-200">
            <RightPanel
              onAIGenerate={onAIGenerate}
              onLuckyGenerate={onLuckyGenerate}
              onDownload={onDownload}
              showToast={showToast}
            />
          </div>
        )}
      </div>

      {/* Mobile action bar - only visible on mobile */}
      {isMobile && (
        <div className="bg-white border-t border-gray-200 p-3 safe-area-inset-bottom">
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 px-4 text-center bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 rounded-lg font-medium transition-colors duration-150"
              onClick={() => setShowLeftPanel(true)}
            >
              🛠️ Tools
            </button>
            <button
              className="flex-1 py-3 px-4 text-center bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 rounded-lg font-medium transition-colors duration-150"
              onClick={() => setShowRightPanel(true)}
            >
              ✨ AI
            </button>
          </div>
        </div>
      )}

      {/* Modal overlays for mobile */}
      {isMobile && showLeftPanel && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLeftPanel(false);
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Tools</h2>
              <button 
                onClick={() => setShowLeftPanel(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none p-1"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
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
          </div>
        </div>
      )}

      {isMobile && showRightPanel && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRightPanel(false);
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">AI Enhancement</h2>
              <button 
                onClick={() => setShowRightPanel(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none p-1"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <RightPanel
                onAIGenerate={onAIGenerate}
                onLuckyGenerate={onLuckyGenerate}
                onDownload={onDownload}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;