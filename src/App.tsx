import React, {useEffect, useState} from 'react';
import {DIProvider} from './core/di/ServicesContext';
import UnifiedLayout from './components/Layout/UnifiedLayout';
import ToastContainer, {ToastType} from './components/Toast/ToastContainer';
import {useAIGeneration} from './features/ai/hooks/useAIGeneration';
import {useEditor} from './features/editor/hooks/useEditor';
import {canvasToBase64} from './utils/canvasUtils';

function AppContent() {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const {
        canvasRef,
        selectedObject,
        backgroundColor,
        copiedObject,
        handleBackgroundColorChange,
        handleAddText,
        handleUpdateText,
        handleImageUpload,
        handleRemoveBackground,
        handleDeleteObject,
        handleCopyObject,
        handleSmartPaste,
        handleClearCanvas,
        handleDownload,
        showClearDialog,
        confirmClearCanvas,
        cancelClearCanvas,
        showApiKeyModal,
        handleApiKeySubmit,
        setShowApiKeyModal,
        handleReplaceCanvasImage,
        handleUndo,
        handleRedo,
        canUndo,
        canRedo,
        saveToHistory,
    } = useEditor({ showToast });

    const {
        isLoading: isAILoading,
        enhance,
        initialize: initializeAI,
    } = useAIGeneration();

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            initializeAI(savedKey);
        }
    }, [initializeAI]);

    const handleAIGenerate = async (videoContext: string, prompt: string) => {
        if (!canvasRef.current) return;
        try {
            const canvasImage = canvasToBase64(canvasRef.current);
            const enhancedImage = await enhance({ canvasImage, videoContext, userPrompt: prompt });
            handleReplaceCanvasImage(enhancedImage);
            saveToHistory();
            showToast('AI enhancement applied!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
            if (error.message.includes('API key')) {
                setShowApiKeyModal(true);
            }
        }
    };

    const handleLuckyGenerate = async (videoContext: string) => {
        if (!canvasRef.current) return;
        try {
            const canvasImage = canvasToBase64(canvasRef.current);
            const enhancedImage = await enhance({ canvasImage, videoContext, isLucky: true });
            handleReplaceCanvasImage(enhancedImage);
            saveToHistory();
            showToast('Lucky enhancement applied!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
            if (error.message.includes('API key')) {
                setShowApiKeyModal(true);
            }
        }
    };

    return (
        <>
            <UnifiedLayout
                canvasRef={canvasRef}
                selectedObject={selectedObject}
                backgroundColor={backgroundColor}
                onBackgroundColorChange={handleBackgroundColorChange}
                onAddText={handleAddText}
                onUpdateText={handleUpdateText}
                onImageUpload={handleImageUpload}
                onRemoveBackground={handleRemoveBackground}
                onDeleteObject={handleDeleteObject}
                onCopyObject={handleCopyObject}
                onPasteObject={handleSmartPaste}
                canPaste={!!copiedObject}
                onClearCanvas={handleClearCanvas}
                onAIGenerate={handleAIGenerate}
                onLuckyGenerate={handleLuckyGenerate}
                onEditApiKey={() => setShowApiKeyModal(true)}
                onDownload={handleDownload}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
                showToast={showToast}
                isLoadingAI={isAILoading}
            />

            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {showApiKeyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">🤖 AI Features Require API Key</h2>
                        <p className="text-gray-600 mb-4">
                            To use AI enhancement features, you'll need a Gemini API key. This enables advanced thumbnail generation and optimization.
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Get your free API key from{' '}
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Google AI Studio
                            </a>
                        </p>
                        <input
                            type="password"
                            placeholder="Enter your Gemini API key"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                    handleApiKeySubmit(e.currentTarget.value);
                                }
                            }}
                            autoFocus
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                                    if (input?.value) {
                                        handleApiKeySubmit(input.value);
                                    }
                                }}
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save & Continue
                            </button>
                            <button
                                onClick={() => setShowApiKeyModal(false)}
                                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showClearDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Clear Canvas
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to clear the canvas? This will remove all objects and cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelClearCanvas}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClearCanvas}
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Clear Canvas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function App() {
    return (
        <DIProvider>
            <AppContent />
        </DIProvider>
    );
}

export default App;