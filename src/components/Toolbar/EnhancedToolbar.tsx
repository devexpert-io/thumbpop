import React, { useState, useRef, useEffect } from 'react';
import { 
  Copy, Clipboard, Trash2, RotateCcw, Undo, Redo, Type, Upload, 
  Palette, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Image, Wand2, Download
} from 'lucide-react';
import { ChromePicker } from 'react-color';
import { FabricObject, IText } from 'fabric';
import { saveTextProperties, loadTextProperties } from '../../utils/textPropertiesUtils';
import AdvancedMobileToolbar from './AdvancedMobileToolbar';

interface EnhancedToolbarProps {
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

const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
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
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);
  const strokePickerRef = useRef<HTMLDivElement>(null);

  // Text properties from selected object
  const [textContent, setTextContent] = useState('');
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

  // Load saved text properties on mount
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
      setTextContent((text as any).text || '');
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

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside color pickers (desktop only)
  useEffect(() => {
    if (isMobile) return; // Skip on mobile

    const handleClickOutside = (event: MouseEvent) => {
      if (bgPickerRef.current && !bgPickerRef.current.contains(event.target as Node)) {
        setShowBgColorPicker(false);
      }
      if (textPickerRef.current && !textPickerRef.current.contains(event.target as Node)) {
        setShowTextColorPicker(false);
      }
      if (strokePickerRef.current && !strokePickerRef.current.contains(event.target as Node)) {
        setShowStrokeColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

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
    
    // Save to persistent storage
    saveTextProperties({ [property]: value });
    
    // Update local state for all properties
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

  // Render mobile version on small screens
  if (isMobile) {
    return (
      <AdvancedMobileToolbar
        selectedObject={selectedObject}
        backgroundColor={backgroundColor}
        onBackgroundColorChange={onBackgroundColorChange}
        onAddText={onAddText}
        onUpdateText={onUpdateText}
        onImageUpload={onImageUpload}
        onRemoveBackground={onRemoveBackground}
        hasSelection={hasSelection}
        canPaste={canPaste}
        onCopy={onCopy}
        onPaste={onPaste}
        onDelete={onDelete}
        onClear={onClear}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onDownload={onDownload}
      />
    );
  }

  // Render desktop version
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center px-4 py-2 gap-2 overflow-x-auto">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-colors ${
              canUndo ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Undo (Ctrl/Cmd+Z)"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-colors ${
              canRedo ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Redo (Ctrl/Cmd+Shift+Z)"
          >
            <Redo size={20} />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Clipboard Operations */}
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            disabled={!hasSelection}
            className={`p-2 rounded transition-colors ${
              hasSelection ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Copy (Ctrl/Cmd+C)"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={onPaste}
            disabled={!canPaste}
            className={`p-2 rounded transition-colors ${
              canPaste ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Paste (Ctrl/Cmd+V)"
          >
            <Clipboard size={20} />
          </button>
          <button
            onClick={onDelete}
            disabled={!hasSelection}
            className={`p-2 rounded transition-colors ${
              hasSelection ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Delete (Delete)"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Background Color */}
        <div className="relative" ref={bgPickerRef}>
          <button
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Background Color"
          >
            <Palette size={20} />
            <div 
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor }}
            />
          </button>
          {showBgColorPicker && (
            <div 
              className="fixed z-[9999]" 
              style={{ 
                top: bgPickerRef.current ? bgPickerRef.current.getBoundingClientRect().bottom + 8 + 'px' : '60px',
                left: bgPickerRef.current ? bgPickerRef.current.getBoundingClientRect().left + 'px' : '0px'
              }}
            >
              <ChromePicker
                color={backgroundColor}
                onChange={(color) => onBackgroundColorChange(color.hex)}
              />
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Text Controls */}
        <button
          onClick={onAddText}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
          title="Add Text"
        >
          <Type size={20} />
          <span className="text-sm font-medium">Add Text</span>
        </button>

        {isTextSelected && (
          <>
            <select
              value={fontFamily}
              onChange={(e) => handleUpdateText('fontFamily', e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={fontSize}
              onChange={(e) => handleUpdateText('fontSize', parseInt(e.target.value) || 48)}
              className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="8"
              max="200"
            />

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleUpdateText('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')}
                className={`p-1.5 rounded transition-colors ${
                  fontWeight === 'bold' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Bold"
              >
                <Bold size={18} />
              </button>
              <button
                onClick={() => handleUpdateText('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')}
                className={`p-1.5 rounded transition-colors ${
                  fontStyle === 'italic' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Italic"
              >
                <Italic size={18} />
              </button>
              <button
                onClick={() => handleUpdateText('underline', textDecoration !== 'underline')}
                className={`p-1.5 rounded transition-colors ${
                  textDecoration === 'underline' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Underline"
              >
                <Underline size={18} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleUpdateText('textAlign', 'left')}
                className={`p-1.5 rounded transition-colors ${
                  textAlign === 'left' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Align Left"
              >
                <AlignLeft size={18} />
              </button>
              <button
                onClick={() => handleUpdateText('textAlign', 'center')}
                className={`p-1.5 rounded transition-colors ${
                  textAlign === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Align Center"
              >
                <AlignCenter size={18} />
              </button>
              <button
                onClick={() => handleUpdateText('textAlign', 'right')}
                className={`p-1.5 rounded transition-colors ${
                  textAlign === 'right' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Align Right"
              >
                <AlignRight size={18} />
              </button>
            </div>

            <div className="relative" ref={textPickerRef}>
              <button
                onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
                title="Text Color"
              >
                <div 
                  className="w-5 h-5 rounded border border-gray-300"
                  style={{ backgroundColor: textColor }}
                />
              </button>
              {showTextColorPicker && (
                <div 
                  className="fixed z-[9999]" 
                  style={{ 
                    top: textPickerRef.current ? textPickerRef.current.getBoundingClientRect().bottom + 8 + 'px' : '60px',
                    left: textPickerRef.current ? textPickerRef.current.getBoundingClientRect().left + 'px' : '0px'
                  }}
                >
                  <ChromePicker
                    color={textColor}
                    onChange={(color) => {
                      setTextColor(color.hex);
                      handleUpdateText('fill', color.hex);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="relative" ref={strokePickerRef}>
              <button
                onClick={() => setShowStrokeColorPicker(!showStrokeColorPicker)}
                className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
                title="Stroke Color"
              >
                <div 
                  className="w-5 h-5 rounded border-2"
                  style={{ borderColor: strokeColor, backgroundColor: 'transparent' }}
                />
              </button>
              {showStrokeColorPicker && (
                <div 
                  className="fixed z-[9999]" 
                  style={{ 
                    top: strokePickerRef.current ? strokePickerRef.current.getBoundingClientRect().bottom + 8 + 'px' : '60px',
                    left: strokePickerRef.current ? strokePickerRef.current.getBoundingClientRect().left + 'px' : '0px'
                  }}
                >
                  <ChromePicker
                    color={strokeColor}
                    onChange={(color) => {
                      setStrokeColor(color.hex);
                      handleUpdateText('stroke', color.hex);
                    }}
                  />
                </div>
              )}
            </div>

            <input
              type="number"
              value={strokeWidth}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setStrokeWidth(value);
                handleUpdateText('strokeWidth', value);
              }}
              className="w-14 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="10"
              step="0.5"
              title="Stroke Width"
            />
          </>
        )}

        <div className="h-6 w-px bg-gray-300" />

        {/* Image Controls */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
          title="Upload Image"
        >
          <Upload size={20} />
          <span className="text-sm font-medium">Upload</span>
        </button>

        {isImageSelected && (
          <button
            onClick={onRemoveBackground}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
            title="Remove Background"
          >
            <Wand2 size={20} />
            <span className="text-sm font-medium">Remove BG</span>
          </button>
        )}

        <div className="h-6 w-px bg-gray-300" />

        {/* Canvas Controls */}
        <button
          onClick={onClear}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Clear Canvas"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
          title="Download Thumbnail"
        >
          <Download size={20} />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>
    </div>
  );
};

export default EnhancedToolbar;