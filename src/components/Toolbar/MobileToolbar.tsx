import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo, Redo, Type, Upload, Download, Copy, Clipboard, Trash2, 
  Palette, Settings, X, Bold, Italic, Underline, AlignLeft, 
  AlignCenter, AlignRight, RotateCcw
} from 'lucide-react';
import { ChromePicker } from 'react-color';
import { FabricObject, IText } from 'fabric';
import { saveTextProperties, loadTextProperties } from '../../utils/textPropertiesUtils';

interface MobileToolbarProps {
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

const MobileToolbar: React.FC<MobileToolbarProps> = ({
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
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showMorePanel, setShowMorePanel] = useState(false);
  
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

  // Auto-open text panel when text is selected
  useEffect(() => {
    if (isTextSelected && !showTextPanel) {
      setShowTextPanel(true);
    }
  }, [isTextSelected]);

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

  const closeAllPanels = () => {
    setShowTextPanel(false);
    setShowColorPanel(false);
    setShowMorePanel(false);
  };

  return (
    <>
      {/* Main Toolbar - Compact */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left: History */}
          <div className="flex items-center gap-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded transition-colors ${
                canUndo ? 'hover:bg-gray-100' : 'opacity-30'
              }`}
            >
              <Undo size={20} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded transition-colors ${
                canRedo ? 'hover:bg-gray-100' : 'opacity-30'
              }`}
            >
              <Redo size={20} />
            </button>
          </div>

          {/* Center: Main Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onAddText}
              className="p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
            >
              <Type size={20} />
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
              className="p-2 rounded hover:bg-gray-100 transition-colors"
            >
              <Upload size={20} />
            </button>

            <button
              onClick={() => setShowColorPanel(!showColorPanel)}
              className="p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <div 
                className="w-5 h-5 rounded border"
                style={{ backgroundColor }}
              />
            </button>
          </div>

          {/* Right: More Actions */}
          <div className="flex items-center gap-1">
            {isTextSelected && (
              <button
                onClick={() => setShowTextPanel(!showTextPanel)}
                className={`p-2 rounded transition-colors ${
                  showTextPanel ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <Settings size={20} />
              </button>
            )}
            
            <button
              onClick={() => setShowMorePanel(!showMorePanel)}
              className={`p-2 rounded transition-colors ${
                showMorePanel ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-1 h-1 bg-current rounded-full" />
              <div className="w-1 h-1 bg-current rounded-full mt-1" />
              <div className="w-1 h-1 bg-current rounded-full mt-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Text Editing Bottom Sheet */}
      {showTextPanel && isTextSelected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Text Formatting</h3>
              <button
                onClick={() => setShowTextPanel(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium mb-2">Font</label>
                <select
                  value={fontFamily}
                  onChange={(e) => handleUpdateText('fontFamily', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {fonts.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium mb-2">Size: {fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="200"
                  value={fontSize}
                  onChange={(e) => handleUpdateText('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Font Style */}
              <div>
                <label className="block text-sm font-medium mb-2">Style</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateText('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`p-3 rounded-lg border ${fontWeight === 'bold' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    onClick={() => handleUpdateText('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`p-3 rounded-lg border ${fontStyle === 'italic' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <Italic size={18} />
                  </button>
                  <button
                    onClick={() => handleUpdateText('underline', textDecoration !== 'underline')}
                    className={`p-3 rounded-lg border ${textDecoration === 'underline' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <Underline size={18} />
                  </button>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-sm font-medium mb-2">Alignment</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateText('textAlign', 'left')}
                    className={`p-3 rounded-lg border ${textAlign === 'left' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <AlignLeft size={18} />
                  </button>
                  <button
                    onClick={() => handleUpdateText('textAlign', 'center')}
                    className={`p-3 rounded-lg border ${textAlign === 'center' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <AlignCenter size={18} />
                  </button>
                  <button
                    onClick={() => handleUpdateText('textAlign', 'right')}
                    className={`p-3 rounded-lg border ${textAlign === 'right' ? 'bg-gray-200' : 'bg-white'}`}
                  >
                    <AlignRight size={18} />
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="space-y-2">
                    <div 
                      className="w-full h-12 rounded-lg border"
                      style={{ backgroundColor: textColor }}
                    />
                    <ChromePicker
                      color={textColor}
                      onChange={(color) => {
                        setTextColor(color.hex);
                        handleUpdateText('fill', color.hex);
                      }}
                      disableAlpha
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Stroke</label>
                  <div className="space-y-2">
                    <div 
                      className="w-full h-12 rounded-lg border-4"
                      style={{ borderColor: strokeColor, backgroundColor: 'transparent' }}
                    />
                    <ChromePicker
                      color={strokeColor}
                      onChange={(color) => {
                        setStrokeColor(color.hex);
                        handleUpdateText('stroke', color.hex);
                      }}
                      disableAlpha
                    />
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Width: {strokeWidth}px</label>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Color Panel */}
      {showColorPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Background Color</h3>
              <button
                onClick={() => setShowColorPanel(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="w-full flex justify-center">
              <ChromePicker
                color={backgroundColor}
                onChange={(color) => onBackgroundColorChange(color.hex)}
                disableAlpha
              />
            </div>
          </div>
        </div>
      )}

      {/* More Actions Panel */}
      {showMorePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">More Actions</h3>
              <button
                onClick={() => setShowMorePanel(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { onCopy(); closeAllPanels(); }}
                disabled={!hasSelection}
                className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex flex-col items-center gap-2"
              >
                <Copy size={24} />
                <span className="text-sm">Copy</span>
              </button>
              
              <button
                onClick={() => { onPaste(); closeAllPanels(); }}
                disabled={!canPaste}
                className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex flex-col items-center gap-2"
              >
                <Clipboard size={24} />
                <span className="text-sm">Paste</span>
              </button>
              
              <button
                onClick={() => { onDelete(); closeAllPanels(); }}
                disabled={!hasSelection}
                className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 flex flex-col items-center gap-2"
              >
                <Trash2 size={24} />
                <span className="text-sm">Delete</span>
              </button>
              
              <button
                onClick={() => { onClear(); closeAllPanels(); }}
                className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2"
              >
                <RotateCcw size={24} />
                <span className="text-sm">Clear</span>
              </button>
              
              {isImageSelected && (
                <button
                  onClick={() => { onRemoveBackground(); closeAllPanels(); }}
                  className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2 col-span-2 bg-purple-50"
                >
                  <Palette size={24} />
                  <span className="text-sm">Remove Background</span>
                </button>
              )}
              
              <button
                onClick={() => { onDownload(); closeAllPanels(); }}
                className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2 col-span-2 bg-green-50"
              >
                <Download size={24} />
                <span className="text-sm">Download Thumbnail</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileToolbar;