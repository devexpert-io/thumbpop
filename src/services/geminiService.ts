import { GoogleGenAI } from '@google/genai';

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string = '';

  initialize(apiKey: string) {
    this.apiKey = apiKey;
    this.ai = new GoogleGenAI({ apiKey });
  }

  async enhanceThumbnail(
    canvasImage: string,
    videoContext: string,
    userPrompt?: string,
    isLucky?: boolean
  ): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini API not initialized. Please set your API key.');
    }

    const fullPrompt = isLucky
      ? `You are an expert YouTube thumbnail designer. Take the following base image, which is for a video about ${videoContext}. Your mission is to transform this image into a viral thumbnail, optimized for the highest possible CTR (Click-Through Rate). Use vibrant colors, impactful typography, dynamic compositions, and professional visual effects to make it stand out on the YouTube homepage. The result must be eye-catching, professional, and generate curiosity. Return only the final image.`
      : `You are an expert YouTube thumbnail designer. Take the following base image, which is for a video about ${videoContext}. Apply these instructions to transform it into a high-impact thumbnail: ${userPrompt}. Return only the final image.`;

    try {
      const model = 'gemini-2.5-flash-image-preview';
      const config = {
        responseModalities: ['IMAGE', 'TEXT'] as string[],
      };

      const contents = [
        {
          role: 'user' as const,
          parts: [
            {
              text: fullPrompt,
            },
            {
              inlineData: {
                mimeType: 'image/png',
                data: canvasImage.split(',')[1],
              },
            },
          ],
        },
      ];

      const response = await this.ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let imageData = '';
      let hasImage = false;

      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
          continue;
        }
        
        const part = chunk.candidates[0].content.parts[0];
        
        if ('inlineData' in part && part.inlineData) {
          imageData = part.inlineData.data || '';
          hasImage = true;
          break;
        }
      }

      if (!hasImage || !imageData) {
        throw new Error('No image was generated. Please try again.');
      }

      return `data:image/png;base64,${imageData}`;
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new Error(error.message || 'Failed to generate enhanced thumbnail');
    }
  }

  isInitialized(): boolean {
    return this.ai !== null;
  }
}

export default new GeminiService();