import React from 'react';
import { ChromePicker } from 'react-color';

interface BackgroundSectionProps {
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

const BackgroundSection: React.FC<BackgroundSectionProps> = ({
  backgroundColor,
  onColorChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color
        </label>
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded border-2 border-gray-300"
            style={{ backgroundColor }}
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#FFFFFF"
          />
        </div>
      </div>
      
      <div className="pt-2">
        <ChromePicker
          color={backgroundColor}
          onChange={(color) => onColorChange(color.hex)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default BackgroundSection;