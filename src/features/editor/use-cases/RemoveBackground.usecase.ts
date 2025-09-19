import { IEditorRepository } from '../types';

export const createRemoveBackgroundUseCase = (editorRepository: IEditorRepository) => ({
    async execute(imageUrl: string): Promise<string> {
        return editorRepository.removeBackground(imageUrl);
    },
});
