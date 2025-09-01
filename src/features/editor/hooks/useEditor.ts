import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, FabricObject, FabricImage } from 'fabric';
import {
    downloadCanvas,
    addTextToCanvas,
    addImageToCanvas,
    saveCanvasState,
    loadCanvasState,
    replaceCanvasWithImage,
} from '../../../utils/canvasUtils';
import backgroundRemovalService from '../../../services/backgroundRemoval';

interface UseEditorProps {
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
}

export function useEditor({ showToast }: UseEditorProps) {
    const canvasRef = useRef<Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [copiedObject, setCopiedObject] = useState<FabricObject | null>(null);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const hasPastedInternalRef = useRef(false);

    // --- History State ---
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isRestoringRef = useRef<boolean>(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateUndoRedoState = useCallback(() => {
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }, []);

    const saveToHistory = useCallback(() => {
        if (!canvasRef.current || isRestoringRef.current) return;

        const canvasState = {
            objects: canvasRef.current.toJSON(),
            backgroundColor: canvasRef.current.backgroundColor,
        };
        const currentState = JSON.stringify(canvasState);

        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        }
        historyRef.current.push(currentState);
        if (historyRef.current.length > 50) {
            historyRef.current.shift();
        } else {
            historyIndexRef.current++;
        }
        updateUndoRedoState();
    }, [updateUndoRedoState]);

    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            if (canvasRef.current) saveCanvasState(canvasRef.current);
        }, 1000);
    }, []);

    const handleUndo = () => {
        if (!canvasRef.current || historyIndexRef.current <= 0) return;
        isRestoringRef.current = true;
        historyIndexRef.current--;
        const prevState = JSON.parse(historyRef.current[historyIndexRef.current]);
        canvasRef.current.loadFromJSON(prevState.objects, () => {
            canvasRef.current!.backgroundColor = prevState.backgroundColor;
            setBackgroundColor(prevState.backgroundColor as string);
            canvasRef.current!.renderAll();
            isRestoringRef.current = false;
            updateUndoRedoState();
        });
    };

    const handleRedo = () => {
        if (!canvasRef.current || historyIndexRef.current >= historyRef.current.length - 1) return;
        isRestoringRef.current = true;
        historyIndexRef.current++;
        const nextState = JSON.parse(historyRef.current[historyIndexRef.current]);
        canvasRef.current.loadFromJSON(nextState.objects, () => {
            canvasRef.current!.backgroundColor = nextState.backgroundColor;
            setBackgroundColor(nextState.backgroundColor as string);
            canvasRef.current!.renderAll();
            isRestoringRef.current = false;
            updateUndoRedoState();
        });
    };

    const handleBackgroundColorChange = (color: string) => {
        setBackgroundColor(color);
        if (canvasRef.current) {
            canvasRef.current.backgroundColor = color;
            canvasRef.current.renderAll();
            saveToHistory();
            debouncedSave();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const loaded = loadCanvasState(canvas);
        if (loaded) {
            setTimeout(() => {
                if (canvas.backgroundColor) {
                    setBackgroundColor(canvas.backgroundColor as string);
                }
                saveToHistory();
            }, 100);
        } else {
            setTimeout(saveToHistory, 100);
        }

        const historyHandler = () => { saveToHistory(); debouncedSave(); };
        const selectionHandler = (e: any) => { setSelectedObject(e.selected?.[0] || null); };

        canvas.on('selection:created', selectionHandler);
        canvas.on('selection:updated', selectionHandler);
        canvas.on('selection:cleared', () => setSelectedObject(null));
        canvas.on('object:added', historyHandler);
        canvas.on('object:removed', historyHandler);
        canvas.on('object:modified', historyHandler);
        canvas.on('path:created', historyHandler);

        return () => {
            canvas.off('selection:created', selectionHandler);
            canvas.off('selection:updated', selectionHandler);
            canvas.off('selection:cleared');
            canvas.off('object:added', historyHandler);
            canvas.off('object:removed', historyHandler);
            canvas.off('object:modified', historyHandler);
            canvas.off('path:created', historyHandler);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [saveToHistory, debouncedSave]);

    const handleAddText = () => { if (canvasRef.current) addTextToCanvas(canvasRef.current); };
    const handleUpdateText = (options: any) => { if (selectedObject) { selectedObject.set(options); canvasRef.current?.renderAll(); } };
    const handleImageUpload = (file: File) => { if (!canvasRef.current) return; const reader = new FileReader(); reader.onload = (e) => { const imageUrl = e.target?.result as string; addImageToCanvas(canvasRef.current!, imageUrl); }; reader.readAsDataURL(file); };
    const handleRemoveBackground = async () => { if (!canvasRef.current || !selectedObject || (selectedObject.type !== 'image' && (selectedObject as any).type !== 'Image')) return; const image = selectedObject as FabricImage; const imageUrl = image.getSrc(); try { const processedImageUrl = await backgroundRemovalService.removeBackground(imageUrl); const newImg = await FabricImage.fromURL(processedImageUrl); newImg.set({ left: image.left, top: image.top, scaleX: image.scaleX, scaleY: image.scaleY, angle: image.angle, }); canvasRef.current?.remove(image); canvasRef.current?.add(newImg); canvasRef.current?.setActiveObject(newImg); canvasRef.current?.renderAll(); setSelectedObject(newImg); } catch (error: any) { showToast(`Failed to remove background: ${error.message}`, 'error'); } };
    const handleDeleteObject = useCallback(() => { if (selectedObject && canvasRef.current) { canvasRef.current.remove(selectedObject); canvasRef.current.discardActiveObject(); setSelectedObject(null); } }, [selectedObject]);
    const handleCopyObject = useCallback(async () => { if (!selectedObject) return; const clonedObject = await selectedObject.clone(); setCopiedObject(clonedObject); hasPastedInternalRef.current = false; }, [selectedObject]);
    const handlePasteObject = () => { if (!copiedObject || !canvasRef.current) return; copiedObject.clone().then((cloned: FabricObject) => { cloned.set({ left: (cloned.left ?? 0) + 10, top: (cloned.top ?? 0) + 10, }); canvasRef.current?.add(cloned); canvasRef.current?.setActiveObject(cloned); canvasRef.current?.renderAll(); }); };
    const handlePasteFromClipboard = async () => { if (!canvasRef.current) return false; try { const clipboardItems = await navigator.clipboard.read(); for (const clipboardItem of clipboardItems) { for (const type of clipboardItem.types) { if (type.startsWith('image/')) { const blob = await clipboardItem.getType(type); const reader = new FileReader(); reader.onload = () => addImageToCanvas(canvasRef.current!, reader.result as string); reader.readAsDataURL(blob); return true; } } if (clipboardItem.types.includes('text/plain')) { const blob = await clipboardItem.getType('text/plain'); const text = await blob.text(); if (text) { addTextToCanvas(canvasRef.current, text); return true; } } } } catch (err) { console.warn('Failed to read clipboard contents: ', err); } return false; };
    const handleSmartPaste = useCallback(async () => { if (copiedObject && !hasPastedInternalRef.current) { handlePasteObject(); hasPastedInternalRef.current = true; return; } const clipboardSuccess = await handlePasteFromClipboard(); if (clipboardSuccess) { hasPastedInternalRef.current = false; } if (!clipboardSuccess && !copiedObject) { hasPastedInternalRef.current = false; } }, [copiedObject]);
    useEffect(() => { const handleKeyDown = (e: KeyboardEvent) => { if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return; if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); } if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) { e.preventDefault(); handleRedo(); } if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); handleDeleteObject(); } if ((e.ctrlKey || e.metaKey) && e.key === 'c') { e.preventDefault(); handleCopyObject(); } if ((e.ctrlKey || e.metaKey) && e.key === 'v') { e.preventDefault(); handleSmartPaste(); } }; document.addEventListener('keydown', handleKeyDown); return () => document.removeEventListener('keydown', handleKeyDown); }, [handleDeleteObject, handleCopyObject, handleSmartPaste, handleUndo, handleRedo]);
    const handleClearCanvas = () => setShowClearDialog(true);
    const cancelClearCanvas = () => setShowClearDialog(false);
    const confirmClearCanvas = () => { if (!canvasRef.current) return; const canvas = canvasRef.current; const bgColor = canvas.backgroundColor; const objects = canvas.getObjects(); objects.forEach(obj => canvas.remove(obj)); canvas.discardActiveObject(); canvas.backgroundColor = bgColor; canvas.renderAll(); setSelectedObject(null); setShowClearDialog(false); saveCanvasState(canvas); };
    const handleDownload = () => { if (canvasRef.current) downloadCanvas(canvasRef.current); };
    const handleApiKeySubmit = (key: string) => { localStorage.setItem('gemini_api_key', key); setShowApiKeyModal(false); };
    const handleReplaceCanvasImage = (imageUrl: string) => { if (canvasRef.current) { replaceCanvasWithImage(canvasRef.current, imageUrl); } };

    return {
        canvasRef,
        selectedObject,
        backgroundColor,
        copiedObject,
        handleBackgroundColorChange,
        handleAddText,
        handleUpdateText,
        handleImageUpload,
        handleRemoveBackground,
        handleDeleteObject,
        handleCopyObject,
        handleSmartPaste,
        handleClearCanvas,
        handleDownload,
        showClearDialog,
        confirmClearCanvas,
        cancelClearCanvas,
        showApiKeyModal,
        setShowApiKeyModal,
        handleApiKeySubmit,
        handleReplaceCanvasImage,
        handleUndo,
        handleRedo,
        canUndo,
        canRedo,
        saveToHistory,
    };
}