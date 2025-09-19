import { IEditorRepository, TextProperties } from '../types';

export const createLoadTextPropertiesUseCase = (editorRepository: IEditorRepository) => ({
    execute(): TextProperties {
        return editorRepository.loadTextProperties();
    },
});
