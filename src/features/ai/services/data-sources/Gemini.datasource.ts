import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import {GenerateImageParams} from "../../types";

let ai: GoogleGenAI | null = null;

export const geminiAIDataSource = {
    initialize(apiKey: string): void {
        ai = new GoogleGenAI({ apiKey });
    },

    isInitialized(): boolean {
        return ai !== null;
    },

    async generateImage(params: GenerateImageParams): Promise<string> {
        if (!ai) {
            throw new Error('Gemini API not initialized. Please set your API key.');
        }

        const fullPrompt = params.isLucky
            ? `You are an expert YouTube thumbnail designer. Take the following base image, which is for a video about ${params.videoContext}. Your mission is to transform this image into a viral thumbnail, optimized for the highest possible CTR (Click-Through Rate). Use vibrant colors, impactful typography, dynamic compositions, and professional visual effects to make it stand out on the YouTube homepage. The result must be eye-catching, professional, and generate curiosity. Return only the final image.`
            : `You are an expert YouTube thumbnail designer. Take the following base image, which is for a video about ${params.videoContext}. Apply these instructions to transform it into a high-impact thumbnail: ${params.userPrompt}. Return only the final image.`;

        try {
            const model = 'gemini-2.5-flash-image-preview';
            const config = {
                responseModalities: ['IMAGE', 'TEXT'] as string[],
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE,
                    },
                ],
            };

            const contents = [
                {
                    role: 'user' as const,
                    parts: [
                        { text: fullPrompt },
                        {
                            inlineData: {
                                mimeType: 'image/png',
                                data: params.canvasImage.split(',')[1],
                            },
                        },
                    ],
                },
            ];

            const response = await ai.models.generateContentStream({
                model,
                config,
                contents,
            });

            let imageData = '';
            let hasImage = false;
            let detailedError = '';
            let chunkCount = 0;

            for await (const chunk of response) {
                chunkCount++;

                if (!chunk.candidates || chunk.candidates.length === 0) {
                    detailedError = `No candidates in response (chunk ${chunkCount})`;
                    continue;
                }

                const candidate = chunk.candidates[0];

                if (candidate.finishReason) {
                    if (candidate.finishReason === 'SAFETY') {
                        detailedError = 'Content was blocked due to safety concerns. Try modifying your prompt to be less sensitive.';
                        continue;
                    }
                    if (candidate.finishReason === 'RECITATION') {
                        detailedError = 'Content was blocked due to copyright concerns.';
                        continue;
                    }
                    if (candidate.finishReason === 'PROHIBITED_CONTENT') {
                        detailedError = 'Content was blocked due to prohibited content policies. This may happen if the image or prompt contains elements that violate Google\'s policies. Try using a different image or modifying your prompt.';
                        continue;
                    }
                    if (candidate.finishReason === 'OTHER') {
                        detailedError = 'Generation was stopped for unspecified reasons. Please try again.';
                        continue;
                    }
                    if (candidate.finishReason === 'MAX_TOKENS') {
                        detailedError = 'Response exceeded maximum token limit.';
                        continue;
                    }
                }

                if (!candidate.content?.parts || candidate.content.parts.length === 0) {
                    detailedError = `No content parts in response (chunk ${chunkCount})`;
                    continue;
                }

                const part = candidate.content.parts[0];

                if ('inlineData' in part && part.inlineData) {
                    imageData = part.inlineData.data || '';
                    if (imageData) {
                        hasImage = true;
                        break;
                    } else {
                        detailedError = `Empty image data in inlineData (chunk ${chunkCount})`;
                    }
                }

                if ('text' in part && part.text) {
                    detailedError = `API returned text instead of image: ${part.text}`;
                }
            }

            if (!hasImage || !imageData) {
                const errorMessage = detailedError || `No image was generated after processing ${chunkCount} chunks. Please try again.`;
                throw new Error(errorMessage);
            }

            return `data:image/png;base64,${imageData}`;
        } catch (error: any) {
            if (error.message) {
                throw new Error(`Gemini API Error: ${error.message}`);
            } else if (error.status) {
                throw new Error(`Gemini API Error (${error.status}): ${error.statusText || 'Unknown error'}`);
            } else {
                throw new Error('Failed to generate enhanced thumbnail. Please check the console for more details.');
            }
        }
    },
};