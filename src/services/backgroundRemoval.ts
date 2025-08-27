import { removeBackground } from '@imgly/background-removal';

class BackgroundRemovalService {
  async removeBackground(imageUrl: string): Promise<string> {
    try {
      const blob = await removeBackground(imageUrl);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error('Failed to read processed image'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Background removal error:', error);
      throw new Error('Failed to remove background. Please try again.');
    }
  }
}

export default new BackgroundRemovalService();