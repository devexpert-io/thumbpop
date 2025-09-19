import { createBackgroundRemovalDataSource } from './BackgroundRemoval.datasource';

jest.mock('@imgly/background-removal', () => ({
    removeBackground: jest.fn(),
}));

describe('BackgroundRemovalDataSource', () => {
    const mockedRemoveBackground = require('@imgly/background-removal').removeBackground as jest.Mock;

    beforeEach(() => {
        mockedRemoveBackground.mockReset();
    });

    it('converts removed background blob to data url', async () => {
        const blob = new Blob(['data'], { type: 'image/png' });
        mockedRemoveBackground.mockResolvedValue(blob);
        const dataSource = createBackgroundRemovalDataSource();

        const result = await dataSource.removeBackground('image-url');

        expect(result).toMatch(/^data:image\/png;base64,/);
        expect(mockedRemoveBackground).toHaveBeenCalledWith('image-url');
    });

    it('throws user-friendly error on failure', async () => {
        mockedRemoveBackground.mockRejectedValue(new Error('failure'));
        const dataSource = createBackgroundRemovalDataSource();

        await expect(dataSource.removeBackground('image-url')).rejects.toThrow(
            'Failed to remove background. Please try again.'
        );
    });
});
