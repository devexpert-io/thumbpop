import React, { useState, useEffect } from 'react';
import ThumbnailCanvas from '../Canvas/ThumbnailCanvas';
import EnhancedToolbar from '../Toolbar/EnhancedToolbar';
import { FabricObject } from 'fabric';
import { Sparkles, Wand2, ChevronDown, ChevronUp, Info, Settings, MessageSquare } from 'lucide-react';

interface UnifiedLayoutProps {
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
  onEditApiKey: () => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
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
  onEditApiKey,
  onDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showToast,
}) => {
  const [videoContext, setVideoContext] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoContext, setShowVideoContext] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  // Load saved video context
  useEffect(() => {
    const saved = localStorage.getItem('thumbpop_videoContext');
    if (saved) setVideoContext(saved);
  }, []);

  // Save video context
  useEffect(() => {
    if (videoContext) {
      localStorage.setItem('thumbpop_videoContext', videoContext);
    }
  }, [videoContext]);

  const handleGenerate = async () => {
    if (!videoContext.trim()) {
      showToast('Please provide video context first', 'warning');
      return;
    }
    if (!userPrompt.trim()) {
      showToast('Please describe the changes you want', 'warning');
      return;
    }
    
    setIsLoading(true);
    try {
      await onAIGenerate(videoContext, userPrompt);
      showToast('AI enhancement applied successfully!', 'success');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleLucky = async () => {
    if (!videoContext.trim()) {
      showToast('Please provide video context first', 'warning');
      setShowVideoContext(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await onLuckyGenerate(videoContext);
      showToast('Lucky enhancement applied!', 'success');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center md:justify-start">
            <img 
              src="/thumbpop.png" 
              alt="ThumbPop" 
              className="h-8 w-auto mr-2"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              ThumbPop
            </h1>
          </div>
          
          {/* Feedback Button */}
          <a
            href="https://github.com/devexpert-io/thumbpop/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Send feedback or report issues"
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Feedback</span>
          </a>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
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
          onEditApiKey={onEditApiKey}
        />
      </div>

      {/* Video Context Bar (Collapsible) */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setShowVideoContext(!showVideoContext)}
            className="w-full py-2 flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>📹 Video Context</span>
              {videoContext && !showVideoContext && (
                <span className="text-gray-500 font-normal truncate max-w-md">
                  {videoContext}
                </span>
              )}
            </div>
            {showVideoContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showVideoContext && (
            <div className="pb-3">
              <textarea
                value={videoContext}
                onChange={(e) => setVideoContext(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                rows={2}
                placeholder="Describe your video content (e.g., A cooking tutorial on how to make the perfect chocolate cake)"
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          {/* Canvas Container with fixed aspect ratio */}
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <ThumbnailCanvas canvasRef={canvasRef} />
            </div>
          </div>
        </div>

        {/* AI Enhancement Controls (Bottom Bar) */}
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Instructions Toggle (Mobile) */}
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="md:hidden flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Info size={16} />
                How it works
              </button>

              {/* Prompt Input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="✨ Describe AI enhancements (e.g., add dramatic lighting, make text glow, cinematic style)"
                  disabled={isLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span className="hidden sm:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span className="hidden sm:inline">Generate</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleLucky}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                  title="Auto-generate with optimized prompt for maximum CTR!"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Wand2 size={18} />
                      <span className="hidden sm:inline">I'm Lucky!</span>
                    </>
                  )}
                </button>

                {/* API Key Settings Button */}
                <button
                  onClick={onEditApiKey}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all flex items-center justify-center"
                  title="Edit Gemini API Key"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            {/* Instructions (Desktop - always visible) */}
            <div className="hidden md:flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium">Quick guide:</span>
                <span>1. Set video context above</span>
                <span>→</span>
                <span>2. Design your thumbnail</span>
                <span>→</span>
                <span>3. Enhance with AI</span>
              </div>
              <div className="ml-auto italic">
                💡 "I'm Lucky" uses an optimized prompt for viral potential!
              </div>
            </div>

            {/* Instructions (Mobile - collapsible) */}
            {showInstructions && (
              <div className="md:hidden mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <p className="font-medium mb-2">Quick guide:</p>
                <ol className="space-y-1">
                  <li>1. Set your video context above</li>
                  <li>2. Design your thumbnail with editor tools</li>
                  <li>3. Use AI to enhance your design</li>
                </ol>
                <p className="mt-2 italic">💡 "I'm Lucky" auto-generates viral thumbnails!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLayout;