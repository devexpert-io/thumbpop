import React, { useState, useEffect } from 'react';
import ThumbnailCanvas from '../Canvas/ThumbnailCanvas';
import RightPanel from '../RightPanel/RightPanel';
import EnhancedToolbar from '../Toolbar/EnhancedToolbar';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showRightPanel, setShowRightPanel] = useState(() => {
    if (window.innerWidth < 768) return false; // Mobile default
    const saved = localStorage.getItem('thumbnailEditor_showRightPanel');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close mobile panels when switching to mobile
      if (mobile) {
        setShowRightPanel(false);
      } else {
        // Restore saved panel state when switching to desktop
        const savedRight = localStorage.getItem('thumbnailEditor_showRightPanel');
        setShowRightPanel(savedRight !== null ? JSON.parse(savedRight) : true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist panel visibility to localStorage (only for desktop)
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('thumbnailEditor_showRightPanel', JSON.stringify(showRightPanel));
    }
  }, [showRightPanel, isMobile]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showRightPanel) setShowRightPanel(false);
      }
    };

    if (isMobile && showRightPanel) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobile, showRightPanel]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Enhanced Toolbar */}
      <div className="bg-white border-b border-gray-200">
        <EnhancedToolbar
          selectedObject={selectedObject}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={onBackgroundColorChange}
          onAddText={onAddText}
          onUpdateText={onUpdateText}
          onImageUpload={onImageUpload}
          onRemoveBackground={onRemoveBackground}
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
          onDownload={onDownload}
        />
      </div>

      {/* Main content area - responsive layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas area - always visible */}
        <div className="flex-1 bg-white shadow-xl m-4 overflow-hidden flex flex-col relative z-10">
          {/* Desktop panel toggle buttons */}
          {!isMobile && (
            <div className="flex justify-end items-center p-3 border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  showRightPanel
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ✨ AI Panel
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
          <button
            className="w-full py-3 px-4 text-center bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 rounded-lg font-medium transition-colors duration-150"
            onClick={() => setShowRightPanel(true)}
          >
            ✨ AI Enhancement
          </button>
        </div>
      )}

      {/* Modal overlay for mobile */}
      {isMobile && showRightPanel && (
        <div 
          className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4"
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