import React from 'react';
import { Copy, Clipboard, Trash2, RotateCcw } from 'lucide-react';

interface ToolbarProps {
  hasSelection: boolean;
  canPaste: boolean;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  hasSelection,
  canPaste,
  onCopy,
  onPaste,
  onDelete,
  onClear,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600 mr-3">Actions:</span>
        
        <button
          onClick={onCopy}
          disabled={!hasSelection}
          className={`p-2 rounded-md transition-colors ${
            hasSelection
              ? 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Copy (Ctrl/Cmd+C)"
        >
          <Copy size={18} />
        </button>
        
        <button
          onClick={onPaste}
          disabled={!canPaste}
          className={`p-2 rounded-md transition-colors ${
            canPaste
              ? 'text-gray-700 hover:bg-green-100 hover:text-green-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Paste (Ctrl/Cmd+V)"
        >
          <Clipboard size={18} />
        </button>
        
        <div className="h-5 w-px bg-gray-300 mx-1" />
        
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={`p-2 rounded-md transition-colors ${
            hasSelection
              ? 'text-gray-700 hover:bg-red-100 hover:text-red-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Delete (Delete/Backspace)"
        >
          <Trash2 size={18} />
        </button>
        
        <div className="h-5 w-px bg-gray-300 mx-1" />
        
        <button
          onClick={onClear}
          className="p-2 rounded-md transition-colors text-gray-700 hover:bg-orange-100 hover:text-orange-700"
          title="Clear Canvas"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;