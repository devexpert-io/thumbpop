import { CanvasStateData, ICanvasStateDataSource } from '../../types';

const STORAGE_KEY = 'thumbpop_canvas';

type StoredCanvasState = CanvasStateData & { timestamp: number };

const parseStoredState = (raw: string | null): StoredCanvasState | null => {
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) {
            return null;
        }

        if (!('objects' in parsed)) {
            return null;
        }

        return {
            backgroundColor: parsed.backgroundColor ?? null,
            objects: parsed.objects,
            timestamp: parsed.timestamp ?? Date.now(),
        };
    } catch (error) {
        console.warn('Failed to parse canvas state from localStorage:', error);
        return null;
    }
};

export const createCanvasStateLocalStorageDataSource = (): ICanvasStateDataSource => ({
    async save(state: CanvasStateData): Promise<void> {
        try {
            const payload: StoredCanvasState = {
                ...state,
                timestamp: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn('Failed to save canvas state to localStorage:', error);
        }
    },

    async load(): Promise<CanvasStateData | null> {
        const stored = parseStoredState(localStorage.getItem(STORAGE_KEY));
        if (!stored) {
            return null;
        }
        return {
            backgroundColor: stored.backgroundColor ?? undefined,
            objects: stored.objects,
        };
    },

    async clear(): Promise<void> {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to clear canvas state from localStorage:', error);
        }
    },
});
