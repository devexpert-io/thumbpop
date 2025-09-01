import { aiRepository } from './AI.repository';
import { geminiAIDataSource } from './data-sources/Gemini.datasource';
import { GenerateImageParams } from '../types';

jest.mock('./data-sources/Gemini.datasource');

const mockedDataSource = geminiAIDataSource as jest.Mocked<typeof geminiAIDataSource>;

describe('aiRepository', () => {
    beforeEach(() => {
        mockedDataSource.initialize.mockClear();
        mockedDataSource.isInitialized.mockClear();
        mockedDataSource.generateImage.mockClear();
    });

    describe('initialize', () => {
        it('should call the data source initialize method with the API key', () => {
            const apiKey = 'test-api-key';
            aiRepository.initialize(apiKey);
            expect(mockedDataSource.initialize).toHaveBeenCalledWith(apiKey);
            expect(mockedDataSource.initialize).toHaveBeenCalledTimes(1);
        });
    });

    describe('isInitialized', () => {
        it('should return true when the data source is initialized', () => {
            mockedDataSource.isInitialized.mockReturnValue(true);
            expect(aiRepository.isInitialized()).toBe(true);
            expect(mockedDataSource.isInitialized).toHaveBeenCalledTimes(1);
        });

        it('should return false when the data source is not initialized', () => {
            mockedDataSource.isInitialized.mockReturnValue(false);
            expect(aiRepository.isInitialized()).toBe(false);
            expect(mockedDataSource.isInitialized).toHaveBeenCalledTimes(1);
        });
    });

    describe('enhance', () => {
        const validParams: GenerateImageParams = {
            canvasImage: 'data:image/png;base64,test-image',
            videoContext: 'Tutorial about React',
            userPrompt: 'Make it colorful',
            isLucky: false,
        };

        it('should call the data source generateImage with the correct parameters', async () => {
            const expectedResult = 'data:image/png;base64,mock-base64-data';
            mockedDataSource.generateImage.mockResolvedValue(expectedResult);

            const result = await aiRepository.enhance(validParams);

            expect(mockedDataSource.generateImage).toHaveBeenCalledWith(validParams);
            expect(mockedDataSource.generateImage).toHaveBeenCalledTimes(1);
            expect(result).toBe(expectedResult);
        });

        it('should propagate errors from the data source', async () => {
            const fakeError = new Error('Fake AI error');
            mockedDataSource.generateImage.mockRejectedValue(fakeError);

            await expect(aiRepository.enhance(validParams)).rejects.toThrow('Fake AI error');
        });
    });
});