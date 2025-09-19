import { ISettingsDataSource } from '../../types';

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const VIDEO_CONTEXT_STORAGE_KEY = 'thumbpop_videoContext';

export const createLocalStorageSettingsDataSource = (): ISettingsDataSource => ({
    getApiKey(): string | null {
        try {
            return localStorage.getItem(API_KEY_STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to read API key from localStorage:', error);
            return null;
        }
    },

    saveApiKey(apiKey: string): void {
        try {
            localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
        } catch (error) {
            console.warn('Failed to save API key to localStorage:', error);
        }
    },

    getVideoContext(): string | null {
        try {
            return localStorage.getItem(VIDEO_CONTEXT_STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to read video context from localStorage:', error);
            return null;
        }
    },

    saveVideoContext(videoContext: string): void {
        try {
            localStorage.setItem(VIDEO_CONTEXT_STORAGE_KEY, videoContext);
        } catch (error) {
            console.warn('Failed to save video context to localStorage:', error);
        }
    },
});
