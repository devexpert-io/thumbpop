import { removeBackground } from '@imgly/background-removal';
import { IBackgroundRemovalDataSource } from '../../types';

export const createBackgroundRemovalDataSource = (): IBackgroundRemovalDataSource => ({
    async removeBackground(imageUrl: string): Promise<string> {
        try {
            const blob = await removeBackground(imageUrl);

            return await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve(reader.result as string);
                    } else {
                        reject(new Error('Failed to read processed image'));
                    }
                };
                reader.onerror = () => reject(new Error('Failed to process image for background removal'));
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Background removal error:', error);
            throw new Error('Failed to remove background. Please try again.');
        }
    },
});
