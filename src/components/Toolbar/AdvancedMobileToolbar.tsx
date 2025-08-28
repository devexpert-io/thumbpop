import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo, Redo, Type, Upload, Download, Copy, Clipboard, Trash2, 
  Palette, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  RotateCcw, Settings, ChevronDown, Wand2, Square, Circle
} from 'lucide-react';
import { ChromePicker } from 'react-color';
import { FabricObject, IText } from 'fabric';
import { saveTextProperties, loadTextProperties } from '../../utils/textPropertiesUtils';

interface AdvancedMobileToolbarProps {
  selectedObject: FabricObject | null;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onAddText: () => void;
  onUpdateText: (options: any) => void;
  onImageUpload: (file: File) => void;
  onRemoveBackground: () => void;
  hasSelection: boolean;
  canPaste: boolean;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDownload: () => void;
}

const fonts = [
  { value: 'Impact', label: 'Impact' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Bebas Neue', label: 'Bebas Neue' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
];

const AdvancedMobileToolbar: React.FC<AdvancedMobileToolbarProps> = ({
  selectedObject,
  backgroundColor,
  onBackgroundColorChange,
  onAddText,
  onUpdateText,
  onImageUpload,
  onRemoveBackground,
  hasSelection,
  canPaste,
  onCopy,
  onPaste,
  onDelete,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onDownload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<'background' | 'text' | 'stroke'>('background');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Text properties
  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('');
  const [textAlign, setTextAlign] = useState('left');

  const isTextSelected = selectedObject && selectedObject.type === 'i-text';
  const isImageSelected = selectedObject && (selectedObject.type === 'image' || (selectedObject as any).type === 'Image');

  // Load saved text properties
  useEffect(() => {
    const savedProperties = loadTextProperties();
    setFontFamily(savedProperties.fontFamily);
    setFontSize(savedProperties.fontSize);
    setTextColor(savedProperties.fill);
    setStrokeColor(savedProperties.stroke);
    setStrokeWidth(savedProperties.strokeWidth);
  }, []);

  // Update text properties when selection changes
  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      const text = selectedObject as IText;
      setFontFamily((text as any).fontFamily || 'Impact');
      setFontSize((text as any).fontSize || 48);
      setTextColor((text as any).fill || '#FFFFFF');
      setStrokeColor((text as any).stroke || '#000000');
      setStrokeWidth((text as any).strokeWidth || 2);
      setFontWeight((text as any).fontWeight || 'normal');
      setFontStyle((text as any).fontStyle || 'normal');
      setTextDecoration((text as any).underline ? 'underline' : '');
      setTextAlign((text as any).textAlign || 'left');
    }
  }, [selectedObject]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      e.target.value = '';
    }
  };

  const handleUpdateText = (property: string, value: any) => {
    if (!selectedObject || selectedObject.type !== 'i-text') return;
    
    const updates: any = { [property]: value };
    saveTextProperties({ [property]: value });
    
    switch (property) {
      case 'fontFamily':
        setFontFamily(value);
        break;
      case 'fontSize':
        setFontSize(value);
        break;
      case 'fill':
        setTextColor(value);
        break;
      case 'stroke':
        setStrokeColor(value);
        break;
      case 'strokeWidth':
        setStrokeWidth(value);
        break;
      case 'fontWeight':
        setFontWeight(value);
        break;
      case 'fontStyle':
        setFontStyle(value);
        break;
      case 'underline':
        setTextDecoration(value ? 'underline' : '');
        break;
      case 'textAlign':
        setTextAlign(value);
        break;
    }
    
    onUpdateText(updates);
  };

  const openColorPicker = (type: 'background' | 'text' | 'stroke') => {
    setColorPickerType(type);
    setShowColorPicker(true);
  };

  const handleColorChange = (color: any) => {
    const hex = color.hex;
    switch (colorPickerType) {
      case 'background':
        onBackgroundColorChange(hex);
        break;
      case 'text':
        setTextColor(hex);
        handleUpdateText('fill', hex);
        break;
      case 'stroke':
        setStrokeColor(hex);
        handleUpdateText('stroke', hex);
        break;
    }
  };

  const getCurrentColor = () => {
    switch (colorPickerType) {
      case 'background': return backgroundColor;
      case 'text': return textColor;
      case 'stroke': return strokeColor;
      default: return backgroundColor;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* ROW 1: Core Actions */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        {/* History */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo ? 'hover:bg-gray-100' : 'opacity-30'
            }`}
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-colors ${
              canRedo ? 'hover:bg-gray-100' : 'opacity-30'
            }`}
            title="Redo"
          >
            <Redo size={18} />
          </button>
        </div>

        {/* Main Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddText}
            className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center gap-1"
          >
            <Type size={18} />
            <span className="text-sm font-medium">Text</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <Upload size={18} />
            <span className="text-sm">Upload</span>
          </button>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg transition-colors ${
              showAdvanced ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            title="More tools"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* ROW 2: Context-Sensitive Controls */}
      <div className="px-3 py-2 border-b border-gray-100">
        {isTextSelected ? (
          // Text Controls
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={fontFamily}
                onChange={(e) => handleUpdateText('fontFamily', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => handleUpdateText('fontSize', parseInt(e.target.value) || 48)}
                  className="w-12 text-sm bg-transparent border-0 p-0"
                  min="8"
                  max="200"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleUpdateText('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')}
                  className={`p-2 rounded transition-colors ${
                    fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={() => handleUpdateText('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')}
                  className={`p-2 rounded transition-colors ${
                    fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={() => handleUpdateText('underline', textDecoration !== 'underline')}
                  className={`p-2 rounded transition-colors ${
                    textDecoration === 'underline' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <Underline size={16} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openColorPicker('text')}
                  className="p-1 rounded border hover:bg-gray-50 flex items-center gap-1"
                  title="Text color"
                >
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: textColor }}
                  />
                  <span className="text-xs">A</span>
                </button>
                <button
                  onClick={() => openColorPicker('stroke')}
                  className="p-1 rounded border hover:bg-gray-50 flex items-center gap-1"
                  title="Stroke color"
                >
                  <div 
                    className="w-4 h-4 rounded border-2"
                    style={{ borderColor: strokeColor, backgroundColor: 'transparent' }}
                  />
                  <span className="text-xs">◯</span>
                </button>
              </div>
            </div>
          </div>
        ) : isImageSelected ? (
          // Image Controls  
          <div className="flex items-center gap-2">
            <button
              onClick={onRemoveBackground}
              className="px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors flex items-center gap-1"
            >
              <Wand2 size={16} />
              <span className="text-sm font-medium">Remove BG</span>
            </button>
            <button
              onClick={() => openColorPicker('background')}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor }}
              />
              <span className="text-sm">Background</span>
            </button>
          </div>
        ) : (
          // Canvas Controls
          <div className="flex items-center gap-2">
            <button
              onClick={() => openColorPicker('background')}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <Palette size={16} />
              <div 
                className="w-4 h-4 rounded border ml-1"
                style={{ backgroundColor }}
              />
              <span className="text-sm">Background</span>
            </button>
            <button
              onClick={onClear}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw size={16} />
              <span className="text-sm">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* ROW 3: Advanced Controls (Expandable) */}
      {showAdvanced && (
        <div className="px-3 py-2 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Alignment */}
            {isTextSelected && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleUpdateText('textAlign', 'left')}
                  className={`p-2 rounded transition-colors ${
                    textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  onClick={() => handleUpdateText('textAlign', 'center')}
                  className={`p-2 rounded transition-colors ${
                    textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  onClick={() => handleUpdateText('textAlign', 'right')}
                  className={`p-2 rounded transition-colors ${
                    textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignRight size={16} />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={onCopy}
                disabled={!hasSelection}
                className={`p-2 rounded transition-colors ${
                  hasSelection ? 'hover:bg-gray-100' : 'opacity-30'
                }`}
                title="Copy"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={onPaste}
                disabled={!canPaste}
                className={`p-2 rounded transition-colors ${
                  canPaste ? 'hover:bg-gray-100' : 'opacity-30'
                }`}
                title="Paste"
              >
                <Clipboard size={16} />
              </button>
              <button
                onClick={onDelete}
                disabled={!hasSelection}
                className={`p-2 rounded transition-colors ${
                  hasSelection ? 'hover:bg-gray-100' : 'opacity-30'
                }`}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Download */}
            <button
              onClick={onDownload}
              className="px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors flex items-center gap-1"
            >
              <Download size={16} />
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>
      )}

      {/* Color Picker Overlay */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">
                {colorPickerType === 'background' ? 'Background Color' : 
                 colorPickerType === 'text' ? 'Text Color' : 'Stroke Color'}
              </h3>
              <button
                onClick={() => setShowColorPicker(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ×
              </button>
            </div>
            
            <div className="flex justify-center">
              <ChromePicker
                color={getCurrentColor()}
                onChange={handleColorChange}
                disableAlpha
              />
            </div>
            
            {colorPickerType === 'stroke' && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Stroke Width: {strokeWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={strokeWidth}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setStrokeWidth(value);
                    handleUpdateText('strokeWidth', value);
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedMobileToolbar;