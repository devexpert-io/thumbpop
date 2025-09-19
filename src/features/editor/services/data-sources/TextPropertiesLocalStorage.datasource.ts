import { ITextPropertiesDataSource, TextProperties } from '../../types';

const STORAGE_KEY = 'thumbpop_text_properties';

const DEFAULT_PROPERTIES: TextProperties = {
    fontFamily: 'Impact',
    fontSize: 48,
    fill: '#FFFFFF',
    stroke: '#000000',
    strokeWidth: 2,
    angle: 0,
};

export const createTextPropertiesLocalStorageDataSource = (): ITextPropertiesDataSource => ({
    load(): TextProperties {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return DEFAULT_PROPERTIES;
            }

            const parsed = JSON.parse(raw);
            if (typeof parsed !== 'object' || parsed === null) {
                return DEFAULT_PROPERTIES;
            }

            return {
                ...DEFAULT_PROPERTIES,
                ...parsed,
            };
        } catch (error) {
            console.warn('Failed to load text properties from localStorage:', error);
            return DEFAULT_PROPERTIES;
        }
    },

    save(properties: Partial<TextProperties>): void {
        try {
            const current = this.load();
            const updated = {
                ...current,
                ...properties,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.warn('Failed to save text properties to localStorage:', error);
        }
    },
});

export const getDefaultTextProperties = (): TextProperties => DEFAULT_PROPERTIES;
