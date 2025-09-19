import { createBackgroundRemovalDataSource } from './BackgroundRemoval.datasource';

jest.mock('@imgly/background-removal', () => ({
    removeBackground: jest.fn(),
}));

const mockedRemoveBackground = require('@imgly/background-removal').removeBackground as jest.Mock;

describe('BackgroundRemovalDataSource', () => {
    beforeEach(() => {
        mockedRemoveBackground.mockReset();
    });

    it('converts blob to data URL', async () => {
        const dataSource = createBackgroundRemovalDataSource();
        const blob = new Blob(['fake'], { type: 'image/png' });
        mockedRemoveBackground.mockResolvedValue(blob);

        const result = await dataSource.removeBackground('image-url');
        expect(result).toContain('data:image/png;base64');
        expect(mockedRemoveBackground).toHaveBeenCalledWith('image-url');
    });

    it('throws error when processing fails', async () => {
        const dataSource = createBackgroundRemovalDataSource();
        mockedRemoveBackground.mockRejectedValue(new Error('fail'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await expect(dataSource.removeBackground('image-url')).rejects.toThrow('Failed to remove background. Please try again.');
        errorSpy.mockRestore();
    });
});
