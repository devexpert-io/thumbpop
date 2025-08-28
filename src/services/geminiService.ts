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
      ? `You are an expert YouTube thumbnail designer. Take the following base image, which is for a video about ${videoContext}.

Objective: Enhance the provided YouTube thumbnail image to dramatically increase its Click-Through Rate (CTR) while preserving its core design elements, text, and overall layout. The goal is to make it look professional, highly engaging, and visually "pop," as if meticulously refined by an expert graphic designer.

Instructions for Enhancement (Apply Subtly to Dramatically, as needed):

1.  Preserve All Text and Key Elements: Absolutely *do not remove or alter* any existing text, logos, or crucial graphic elements. Your task is to enhance them, not replace them.
2.  Subject Enhancement (If applicable): If there's a main subject (person, object), subtly or dramatically enhance it to make it stand out. This can involve:
    * Slightly increasing sharpness and detail.
    * Adding a subtle glow or outline to make it pop from the background.
    * Improving lighting to highlight key features.
3.  Color & Contrast Refinement:
    * Adjust the overall color palette to be more vibrant and appealing without changing the original hues too drastically.
    * Boost contrast to add depth and visual impact, ensuring readability of all elements.
    * Apply a professional color grade that makes the image feel polished and high-quality.
4.  Lighting & Shadows:
    * Enhance existing lighting or introduce subtle dynamic lighting to create depth and focus.
    * Refine shadows to add drama and separate elements, without obscuring details.
5.  Background Integration/Subtlety: If the background is complex, make sure it supports the foreground elements without distracting from them. If it's simple, subtly enhance its texture or light to add interest.
6.  Overall Polish & Impact:
    * Aim for a "clean but impactful" aesthetic. The image should feel professional and intentional.
    * Consider subtle additions like cinematic light rays, dust particles, or a very slight vignette if they enhance the mood without cluttering.
    * Ensure the final result is visually cohesive and optimized for small-screen viewing (like on a phone).

Your primary directive is to elevate the existing design, making it more professional, eye-catching, and effective for YouTube, without altering its fundamental structure or content. Think of yourself as a master retoucher and enhancer, not a re-designer. Surprise me with improved clarity and impact.

Return only the final image.`
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
      let detailedError = '';

      for await (const chunk of response) {
        // Log chunk for debugging
        console.log('API Response Chunk:', JSON.stringify(chunk, null, 2));
        
        if (!chunk.candidates || chunk.candidates.length === 0) {
          detailedError = 'No candidates in response';
          continue;
        }
        
        const candidate = chunk.candidates[0];
        
        // Check for safety ratings or blocked content
        if (candidate.finishReason === 'SAFETY') {
          detailedError = 'Content was blocked due to safety concerns. Try modifying your prompt to be less sensitive.';
          continue;
        }
        
        if (candidate.finishReason === 'RECITATION') {
          detailedError = 'Content was blocked due to copyright concerns.';
          continue;
        }
        
        if (candidate.finishReason === 'OTHER') {
          detailedError = 'Generation was stopped for unspecified reasons. Please try again.';
          continue;
        }
        
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          detailedError = 'No content parts in response';
          continue;
        }
        
        const part = candidate.content.parts[0];
        
        if ('inlineData' in part && part.inlineData) {
          imageData = part.inlineData.data || '';
          if (imageData) {
            hasImage = true;
            break;
          }
        }
        
        // Check for text responses which might contain error information
        if ('text' in part && part.text) {
          detailedError = `API returned text instead of image: ${part.text}`;
        }
      }

      if (!hasImage || !imageData) {
        const errorMessage = detailedError || 'No image was generated. Please try again.';
        throw new Error(errorMessage);
      }

      return `data:image/png;base64,${imageData}`;
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      // Provide more context about the error
      if (error.message) {
        throw new Error(`Gemini API Error: ${error.message}`);
      } else if (error.status) {
        throw new Error(`Gemini API Error (${error.status}): ${error.statusText || 'Unknown error'}`);
      } else {
        throw new Error('Failed to generate enhanced thumbnail. Please check the console for more details.');
      }
    }
  }

  isInitialized(): boolean {
    return this.ai !== null;
  }
}

export default new GeminiService();