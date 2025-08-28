import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { Type, RotateCw } from 'lucide-react';
import { FabricObject, IText } from 'fabric';
import { saveTextProperties, loadTextProperties } from '../../utils/textPropertiesUtils';

interface TextSectionProps {
  selectedObject: FabricObject | null;
  onAddText: () => void;
  onUpdateText: (options: any) => void;
}

const fonts = [
  { value: 'Impact', label: 'Impact' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
];

const TextSection: React.FC<TextSectionProps> = ({
  selectedObject,
  onAddText,
  onUpdateText,
}) => {
  const [textContent, setTextContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [rotation, setRotation] = useState(0);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);

  // Load saved text properties on component mount
  useEffect(() => {
    const savedProperties = loadTextProperties();
    setFontFamily(savedProperties.fontFamily);
    setFontSize(savedProperties.fontSize);
    setTextColor(savedProperties.fill);
    setStrokeColor(savedProperties.stroke);
    setStrokeWidth(savedProperties.strokeWidth);
    setRotation(savedProperties.angle);
  }, []);

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      const text = selectedObject as IText;
      setTextContent((text as any).text || '');
      setFontFamily((text as any).fontFamily || 'Impact');
      setFontSize((text as any).fontSize || 48);
      setTextColor((text as any).fill || '#FFFFFF');
      setStrokeColor((text as any).stroke || '#000000');
      setStrokeWidth((text as any).strokeWidth || 2);
      setRotation((text as any).angle || 0);
    }
  }, [selectedObject]);

  const handleUpdate = (property: string, value: any) => {
    if (!selectedObject || selectedObject.type !== 'i-text') return;
    
    const updates: any = { [property]: value };
    
    // Save to persistent storage
    saveTextProperties({ [property]: value });
    
    switch (property) {
      case 'text':
        setTextContent(value);
        break;
      case 'fontFamily':
        setFontFamily(value);
        saveTextProperties({ fontFamily: value });
        break;
      case 'fontSize':
        setFontSize(value);
        saveTextProperties({ fontSize: value });
        break;
      case 'fill':
        setTextColor(value);
        saveTextProperties({ fill: value });
        break;
      case 'stroke':
        setStrokeColor(value);
        saveTextProperties({ stroke: value });
        break;
      case 'strokeWidth':
        setStrokeWidth(value);
        saveTextProperties({ strokeWidth: value });
        break;
      case 'angle':
        setRotation(value);
        saveTextProperties({ angle: value });
        break;
    }
    
    onUpdateText(updates);
  };

  const isTextSelected = selectedObject && selectedObject.type === 'i-text';

  return (
    <div className="space-y-4">
      <button
        onClick={onAddText}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
      >
        <Type size={20} />
        <span>Add Text</span>
      </button>

      {isTextSelected && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Content
            </label>
            <textarea
              value={textContent}
              onChange={(e) => handleUpdate('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter your text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={fontFamily}
              onChange={(e) => handleUpdate('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="200"
              value={fontSize}
              onChange={(e) => handleUpdate('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                className="w-12 h-12 rounded border-2 border-gray-300"
                style={{ backgroundColor: textColor }}
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => handleUpdate('fill', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {showTextColorPicker && (
              <div className="mt-2">
                <ChromePicker
                  color={textColor}
                  onChange={(color) => handleUpdate('fill', color.hex)}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stroke Color
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStrokeColorPicker(!showStrokeColorPicker)}
                className="w-12 h-12 rounded border-2 border-gray-300"
                style={{ backgroundColor: strokeColor }}
              />
              <input
                type="text"
                value={strokeColor}
                onChange={(e) => handleUpdate('stroke', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {showStrokeColorPicker && (
              <div className="mt-2">
                <ChromePicker
                  color={strokeColor}
                  onChange={(color) => handleUpdate('stroke', color.hex)}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stroke Width: {strokeWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={strokeWidth}
              onChange={(e) => handleUpdate('strokeWidth', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <RotateCw size={16} className="inline mr-2" />
              Rotation: {rotation}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={rotation}
              onChange={(e) => handleUpdate('angle', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TextSection;