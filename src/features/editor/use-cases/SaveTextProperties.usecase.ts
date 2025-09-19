import { IEditorRepository, TextProperties } from '../types';

export const createSaveTextPropertiesUseCase = (editorRepository: IEditorRepository) => ({
    execute(properties: Partial<TextProperties>): void {
        editorRepository.saveTextProperties(properties);
    },
});
