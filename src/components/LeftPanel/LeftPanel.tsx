import React, { useState } from 'react';
import BackgroundSection from './BackgroundSection';
import TextSection from './TextSection';
import ImageSection from './ImageSection';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FabricObject } from 'fabric';

interface LeftPanelProps {
  selectedObject: FabricObject | null;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onAddText: () => void;
  onUpdateText: (options: any) => void;
  onImageUpload: (file: File) => void;
  onRemoveBackground: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  selectedObject,
  backgroundColor,
  onBackgroundColorChange,
  onAddText,
  onUpdateText,
  onImageUpload,
  onRemoveBackground,
}) => {
  const [expandedSection, setExpandedSection] = useState<string>('background');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-xl font-bold">Editor Controls</h2>
      </div>
      
      
      <div className="flex-1 overflow-y-auto">
        <div className="border-b">
          <button
            onClick={() => toggleSection('background')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold">Background</span>
            {expandedSection === 'background' ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSection === 'background' && (
            <div className="p-4 bg-gray-50">
              <BackgroundSection
                backgroundColor={backgroundColor}
                onColorChange={onBackgroundColorChange}
              />
            </div>
          )}
        </div>

        <div className="border-b">
          <button
            onClick={() => toggleSection('text')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold">Text</span>
            {expandedSection === 'text' ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSection === 'text' && (
            <div className="p-4 bg-gray-50">
              <TextSection
                selectedObject={selectedObject}
                onAddText={onAddText}
                onUpdateText={onUpdateText}
              />
            </div>
          )}
        </div>

        <div className="border-b">
          <button
            onClick={() => toggleSection('images')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold">Images</span>
            {expandedSection === 'images' ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expandedSection === 'images' && (
            <div className="p-4 bg-gray-50">
              <ImageSection
                selectedObject={selectedObject}
                onImageUpload={onImageUpload}
                onRemoveBackground={onRemoveBackground}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;