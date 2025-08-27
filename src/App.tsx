import React, { useRef, useState, useEffect } from 'react';
import { Canvas, FabricObject, FabricImage, IText } from 'fabric';
import AppLayout from './components/Layout/AppLayout';
import geminiService from './services/geminiService';
import backgroundRemovalService from './services/backgroundRemoval';
import {
  canvasToBase64,
  downloadCanvas,
  addTextToCanvas,
  addImageToCanvas,
  replaceCanvasWithImage,
  saveCanvasState,
  loadCanvasState,
} from './utils/canvasUtils';

function App() {
  const canvasRef = useRef<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#1e40af');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(true);
  const [copiedObject, setCopiedObject] = useState<any>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save function
  const debouncedSave = () => {
    if (!canvasRef.current) return;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      if (canvasRef.current) {
        saveCanvasState(canvasRef.current);
      }
    }, 1000); // Save 1 second after last change
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      geminiService.initialize(savedKey);
      setShowApiKeyModal(false);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Delete or Backspace key
      if ((e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedObject && canvasRef.current) {
          e.preventDefault();
          canvasRef.current.remove(selectedObject);
          canvasRef.current.discardActiveObject();
          canvasRef.current.renderAll();
          setSelectedObject(null);
        }
      }
      
      // Copy (Ctrl/Cmd + C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedObject) {
          e.preventDefault();
          handleCopyObject();
        }
      }
      
      // Paste (Ctrl/Cmd + V)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (copiedObject) {
          e.preventDefault();
          handlePasteObject();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedObject, copiedObject]);

  useEffect(() => {
    const setupCanvasEvents = () => {
      if (!canvasRef.current) {
        return;
      }
      
      const canvas = canvasRef.current;
      
      // Load saved state when canvas is first ready
      const hasLoadedState = loadCanvasState(canvas);
      if (hasLoadedState) {
        // Update background color state to match loaded state
        if (canvas.backgroundColor) {
          setBackgroundColor(canvas.backgroundColor as string);
        }
      }
      
      canvas.on('selection:created', (e: any) => {
        const obj = e.selected?.[0] || null;
        setSelectedObject(obj);
      });
      
      canvas.on('selection:updated', (e: any) => {
        const obj = e.selected?.[0] || null;
        setSelectedObject(obj);
      });
      
      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });
      
      // Auto-save on canvas changes
      const saveHandler = () => {
        debouncedSave();
      };
      
      canvas.on('object:added', saveHandler);
      canvas.on('object:removed', saveHandler);
      canvas.on('object:modified', saveHandler);
      canvas.on('path:created', saveHandler);
      
      return () => {
        canvas.off('selection:created');
        canvas.off('selection:updated');
        canvas.off('selection:cleared');
        canvas.off('object:added', saveHandler);
        canvas.off('object:removed', saveHandler);
        canvas.off('object:modified', saveHandler);
        canvas.off('path:created', saveHandler);
      };
    };
    
    // Try immediately
    const cleanup = setupCanvasEvents();
    
    // Also try after a short delay to ensure canvas is ready
    const timer = setTimeout(() => {
      setupCanvasEvents();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      cleanup?.();
      // Cleanup auto-save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    geminiService.initialize(key);
    setShowApiKeyModal(false);
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    if (canvasRef.current) {
      canvasRef.current.backgroundColor = color;
      canvasRef.current.renderAll();
      debouncedSave(); // Auto-save background color changes
    }
  };

  const handleAddText = () => {
    if (!canvasRef.current) return;
    addTextToCanvas(canvasRef.current);
  };

  const handleUpdateText = (options: any) => {
    if (!selectedObject || !canvasRef.current) return;
    selectedObject.set(options);
    canvasRef.current.renderAll();
  };

  const handleImageUpload = async (file: File) => {
    if (!canvasRef.current) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      await addImageToCanvas(canvasRef.current!, imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!selectedObject || (selectedObject.type !== 'image' && (selectedObject as any).type !== 'Image') || !canvasRef.current) return;
    
    const image = selectedObject as FabricImage;
    const imageUrl = image.getSrc();
    
    try {
      console.log('Starting background removal...');
      const startTime = performance.now();
      
      const processedImageUrl = await backgroundRemovalService.removeBackground(imageUrl);
      
      const endTime = performance.now();
      console.log(`Background removed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
      
      await FabricImage.fromURL(processedImageUrl).then((newImg) => {
        newImg.set({
          left: image.left,
          top: image.top,
          scaleX: image.scaleX,
          scaleY: image.scaleY,
          angle: image.angle,
        });
        
        canvasRef.current?.remove(image);
        canvasRef.current?.add(newImg);
        canvasRef.current?.setActiveObject(newImg);
        canvasRef.current?.renderAll();
        setSelectedObject(newImg);
      });
      
      // Success feedback
      console.log('✅ Background removed successfully!');
    } catch (error: any) {
      console.error('Background removal error:', error);
      alert(`Failed to remove background: ${error.message}`);
    }
  };

  const handleAIGenerate = async (videoContext: string, prompt: string) => {
    if (!canvasRef.current) return;
    
    try {
      const canvasImage = canvasToBase64(canvasRef.current);
      const enhancedImage = await geminiService.enhanceThumbnail(
        canvasImage,
        videoContext,
        prompt,
        false
      );
      await replaceCanvasWithImage(canvasRef.current, enhancedImage);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLuckyGenerate = async (videoContext: string) => {
    if (!canvasRef.current) return;
    
    try {
      const canvasImage = canvasToBase64(canvasRef.current);
      const enhancedImage = await geminiService.enhanceThumbnail(
        canvasImage,
        videoContext,
        undefined,
        true
      );
      await replaceCanvasWithImage(canvasRef.current, enhancedImage);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteObject = () => {
    if (!selectedObject || !canvasRef.current) return;
    
    canvasRef.current.remove(selectedObject);
    canvasRef.current.discardActiveObject();
    canvasRef.current.renderAll();
    setSelectedObject(null);
  };

  const handleCopyObject = () => {
    if (!selectedObject || !canvasRef.current) return;
    
    selectedObject.clone().then((cloned: any) => {
      setCopiedObject(cloned);
    });
  };

  const handlePasteObject = () => {
    if (!copiedObject || !canvasRef.current) return;
    
    copiedObject.clone().then((cloned: any) => {
      cloned.set({
        left: cloned.left + 10,
        top: cloned.top + 10,
      });
      canvasRef.current?.add(cloned);
      canvasRef.current?.setActiveObject(cloned);
      canvasRef.current?.renderAll();
      setSelectedObject(cloned);
    });
  };

  const handleClearCanvas = () => {
    setShowClearDialog(true);
  };

  const confirmClearCanvas = () => {
    if (!canvasRef.current) return;
    
    // Clear all objects but preserve background color
    const bgColor = canvasRef.current.backgroundColor;
    canvasRef.current.clear();
    canvasRef.current.backgroundColor = bgColor;
    canvasRef.current.renderAll();
    
    setSelectedObject(null);
    setShowClearDialog(false);
    
    // Save immediately after clearing
    saveCanvasState(canvasRef.current);
  };

  const cancelClearCanvas = () => {
    setShowClearDialog(false);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvas(canvasRef.current);
  };

  if (showApiKeyModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to YouTube Thumbnail Pro!</h2>
          <p className="text-gray-600 mb-4">
            To use the AI enhancement features, please enter your Gemini API key.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            You can get your API key from{' '}
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
              Continue
            </button>
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Skip (Editor Only)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppLayout
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
        onPasteObject={handlePasteObject}
        canPaste={!!copiedObject}
        onClearCanvas={handleClearCanvas}
        onAIGenerate={handleAIGenerate}
        onLuckyGenerate={handleLuckyGenerate}
        onDownload={handleDownload}
      />
      
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

export default App;