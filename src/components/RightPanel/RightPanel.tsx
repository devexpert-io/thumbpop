import React from 'react';
import AIControls from './AIControls';
import { Download } from 'lucide-react';

interface RightPanelProps {
  onAIGenerate: (videoContext: string, prompt: string) => void;
  onLuckyGenerate: (videoContext: string) => void;
  onDownload: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  onAIGenerate,
  onLuckyGenerate,
  onDownload,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <h2 className="text-xl font-bold">AI Enhancement</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <AIControls
          onAIGenerate={onAIGenerate}
          onLuckyGenerate={onLuckyGenerate}
        />
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={onDownload}
          className="w-full py-3 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
        >
          <Download size={20} />
          <span>Download Thumbnail</span>
        </button>
      </div>
    </div>
  );
};

export default RightPanel;