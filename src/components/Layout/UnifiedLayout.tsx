import React, { useState, useEffect } from 'react';
import ThumbnailCanvas from '../Canvas/ThumbnailCanvas';
import EnhancedToolbar from '../Toolbar/EnhancedToolbar';
import { FabricObject } from 'fabric';
import { Sparkles, Wand2, ChevronDown, ChevronUp, Info, Settings, MessageSquare } from 'lucide-react';

interface UnifiedLayoutProps {
    canvasRef: React.RefObject<any>;
    selectedObject: FabricObject | null;
    backgroundColor: string;
    isLoadingAI: boolean;
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
                                                         isLoadingAI,
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
    const [showVideoContext, setShowVideoContext] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('thumbpop_videoContext');
        if (saved) setVideoContext(saved);
    }, []);

    useEffect(() => {
        if (videoContext) {
            localStorage.setItem('thumbpop_videoContext', videoContext);
        }
    }, [videoContext]);

    const handleGenerate = () => {
        if (!videoContext.trim()) {
            showToast('Please provide video context first', 'warning');
            return;
        }
        if (!userPrompt.trim()) {
            showToast('Please describe the changes you want', 'warning');
            return;
        }
        onAIGenerate(videoContext, userPrompt);
    };

    const handleLucky = () => {
        if (!videoContext.trim()) {
            showToast('Please provide video context first', 'warning');
            setShowVideoContext(true);
            return;
        }
        onLuckyGenerate(videoContext);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header with Logo */}
            <div className="bg-white border-b border-gray-100 px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center md:justify-start">
                        <img
                            src={`${process.env.PUBLIC_URL}/thumbpop.png`}
                            alt="ThumbPop"
                            className="h-8 w-auto mr-2"
                        />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                            ThumbPop
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="https://github.com/devexpert-io/thumbpop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            title="View source code on GitHub"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span className="hidden sm:inline">GitHub</span>
                        </a>

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
            </div>

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
                  disabled={isLoadingAI}
              />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-7xl">
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                            <ThumbnailCanvas
                                canvasRef={canvasRef}
                                onDrop={(files) => {
                                    files.forEach(file => onImageUpload(file));
                                    showToast(`${files.length} image(s) added to canvas`, 'success');
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-gray-200 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <button
                                onClick={() => setShowInstructions(!showInstructions)}
                                className="md:hidden flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                <Info size={16} />
                                How it works
                            </button>

                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={userPrompt}
                                    onChange={(e) => setUserPrompt(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                    placeholder="✨ Describe AI enhancements (e.g., add dramatic lighting, make text glow, cinematic style)"
                                    disabled={isLoadingAI}
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoadingAI}
                                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                                >
                                    {isLoadingAI ? (
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
                                    disabled={isLoadingAI}
                                    className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                                    title="Auto-generate with optimized prompt for maximum CTR!"
                                >
                                    {isLoadingAI ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    ) : (
                                        <>
                                            <Wand2 size={18} />
                                            <span className="hidden sm:inline">I'm Lucky!</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onEditApiKey}
                                    className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all flex items-center justify-center"
                                    title="Edit Gemini API Key"
                                >
                                    <Settings size={18} />
                                </button>
                            </div>
                        </div>

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