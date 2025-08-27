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
} from './utils/canvasUtils';

function App() {
  const canvasRef = useRef<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#1e40af');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      geminiService.initialize(savedKey);
      setShowApiKeyModal(false);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    canvas.on('selection:created', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    canvas.on('selection:updated', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    return () => {
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');
    };
  }, [canvasRef.current]);

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
    if (!selectedObject || selectedObject.type !== 'image' || !canvasRef.current) return;
    
    const image = selectedObject as FabricImage;
    const imageUrl = image.getSrc();
    
    try {
      const processedImageUrl = await backgroundRemovalService.removeBackground(imageUrl);
      
      FabricImage.fromURL(processedImageUrl).then((newImg) => {
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
    } catch (error: any) {
      alert(error.message);
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
    <AppLayout
      canvasRef={canvasRef}
      selectedObject={selectedObject}
      backgroundColor={backgroundColor}
      onBackgroundColorChange={handleBackgroundColorChange}
      onAddText={handleAddText}
      onUpdateText={handleUpdateText}
      onImageUpload={handleImageUpload}
      onRemoveBackground={handleRemoveBackground}
      onAIGenerate={handleAIGenerate}
      onLuckyGenerate={handleLuckyGenerate}
      onDownload={handleDownload}
    />
  );
}

export default App;