import React, { useState } from 'react';
import { Sparkles, Wand2, AlertCircle } from 'lucide-react';

interface AIControlsProps {
  onAIGenerate: (videoContext: string, prompt: string) => void;
  onLuckyGenerate: (videoContext: string) => void;
}

const AIControls: React.FC<AIControlsProps> = ({
  onAIGenerate,
  onLuckyGenerate,
}) => {
  const [videoContext, setVideoContext] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!videoContext.trim()) {
      alert('Please provide video context first');
      return;
    }
    if (!userPrompt.trim()) {
      alert('Please describe the changes you want');
      return;
    }
    
    setIsLoading(true);
    try {
      await onAIGenerate(videoContext, userPrompt);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLucky = async () => {
    if (!videoContext.trim()) {
      alert('Please provide video context first');
      return;
    }
    
    setIsLoading(true);
    try {
      await onLuckyGenerate(videoContext);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="text-blue-600 mt-1" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How it works:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Design your base thumbnail using the editor</li>
              <li>Describe your video content below</li>
              <li>Use AI to enhance or transform your design</li>
            </ol>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Context
        </label>
        <textarea
          value={videoContext}
          onChange={(e) => setVideoContext(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="e.g., A cooking tutorial on how to make the perfect cheesecake"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Describe the changes you want
        </label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={4}
          placeholder="e.g., Make the text look like neon, add a dramatic light beam, and give it a more cinematic style"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate with AI</span>
            </>
          )}
        </button>

        <button
          onClick={handleLucky}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-md hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>I'm Feeling Lucky!</span>
            </>
          )}
        </button>
      </div>

      <div className="text-xs text-gray-500 italic">
        <p>💡 Pro tip: The "I'm Feeling Lucky" button uses an optimized prompt for maximum CTR and viral potential!</p>
      </div>
    </div>
  );
};

export default AIControls;