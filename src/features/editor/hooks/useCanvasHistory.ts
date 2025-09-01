import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from 'fabric';
import { saveCanvasState } from '../../../utils/canvasUtils';

interface UseCanvasHistoryProps {
    canvasRef: React.RefObject<Canvas | null>;
}

export function useCanvasHistory({ canvasRef }: UseCanvasHistoryProps) {
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
        const currentState = JSON.stringify(canvasRef.current.toJSON());
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
    }, [canvasRef, updateUndoRedoState]);

    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            if (canvasRef.current) saveCanvasState(canvasRef.current);
        }, 1000);
    }, [canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const historyHandler = () => {
            saveToHistory();
            debouncedSave();
        };
        canvas.on('object:added', historyHandler);
        canvas.on('object:removed', historyHandler);
        canvas.on('object:modified', historyHandler);
        canvas.on('path:created', historyHandler);

        setTimeout(saveToHistory, 100);

        return () => {
            canvas.off('object:added', historyHandler);
            canvas.off('object:removed', historyHandler);
            canvas.off('object:modified', historyHandler);
            canvas.off('path:created', historyHandler);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [canvasRef, saveToHistory, debouncedSave]);

    const handleUndo = () => {
        if (!canvasRef.current || historyIndexRef.current <= 0) return;
        isRestoringRef.current = true;
        historyIndexRef.current--;
        const prevState = JSON.parse(historyRef.current[historyIndexRef.current]);
        canvasRef.current.loadFromJSON(prevState, () => {
            canvasRef.current?.renderAll();
            isRestoringRef.current = false;
            updateUndoRedoState();
        });
    };

    const handleRedo = () => {
        if (!canvasRef.current || historyIndexRef.current >= historyRef.current.length - 1) return;
        isRestoringRef.current = true;
        historyIndexRef.current++;
        const nextState = JSON.parse(historyRef.current[historyIndexRef.current]);
        canvasRef.current.loadFromJSON(nextState, () => {
            canvasRef.current?.renderAll();
            isRestoringRef.current = false;
            updateUndoRedoState();
        });
    };

    return {
        handleUndo,
        handleRedo,
        canUndo,
        canRedo,
        saveToHistory,
    };
}