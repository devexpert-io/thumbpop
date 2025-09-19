import { IAIRepository, IAISettingsRepository } from '../../features/ai/types';
import { createEnhanceThumbnailUseCase } from '../../features/ai/use-cases/EnhanceThumbnail.usecase';
import { geminiAIDataSource } from '../../features/ai/services/data-sources/Gemini.datasource';
import { createAIRepository } from '../../features/ai/services/AI.repository';
import { createLocalStorageAISettingsDataSource } from '../../features/ai/services/data-sources/LocalStorageSettings.datasource';
import { createAISettingsRepository } from '../../features/ai/services/AISettings.repository';
import { createGetStoredApiKeyUseCase } from '../../features/ai/use-cases/GetStoredApiKey.usecase';
import { createSaveApiKeyUseCase } from '../../features/ai/use-cases/SaveApiKey.usecase';
import { createGetVideoContextUseCase } from '../../features/ai/use-cases/GetVideoContext.usecase';
import { createSaveVideoContextUseCase } from '../../features/ai/use-cases/SaveVideoContext.usecase';
import { createCanvasStateLocalStorageDataSource } from '../../features/editor/services/data-sources/CanvasStateLocalStorage.datasource';
import { createTextPropertiesLocalStorageDataSource } from '../../features/editor/services/data-sources/TextPropertiesLocalStorage.datasource';
import { createBackgroundRemovalDataSource } from '../../features/editor/services/data-sources/BackgroundRemoval.datasource';
import { createFabricImageDataSource } from '../../features/editor/services/data-sources/FabricImage.datasource';
import { createEditorRepository } from '../../features/editor/services/Editor.repository';
import { IEditorRepository } from '../../features/editor/types';
import { createAddTextUseCase } from '../../features/editor/use-cases/AddText.usecase';
import { createAddImageUseCase } from '../../features/editor/use-cases/AddImage.usecase';
import { createReplaceCanvasImageUseCase } from '../../features/editor/use-cases/ReplaceCanvasImage.usecase';
import { createCanvasToBase64UseCase } from '../../features/editor/use-cases/CanvasToBase64.usecase';
import { createDownloadCanvasUseCase } from '../../features/editor/use-cases/DownloadCanvas.usecase';
import { createSaveCanvasStateUseCase } from '../../features/editor/use-cases/SaveCanvasState.usecase';
import { createLoadCanvasStateUseCase } from '../../features/editor/use-cases/LoadCanvasState.usecase';
import { createClearCanvasStateUseCase } from '../../features/editor/use-cases/ClearCanvasState.usecase';
import { createRemoveBackgroundUseCase } from '../../features/editor/use-cases/RemoveBackground.usecase';
import { createLoadTextPropertiesUseCase } from '../../features/editor/use-cases/LoadTextProperties.usecase';
import { createSaveTextPropertiesUseCase } from '../../features/editor/use-cases/SaveTextProperties.usecase';

const aiRepository = createAIRepository(geminiAIDataSource);
const enhanceThumbnailUseCase = createEnhanceThumbnailUseCase(aiRepository);

const aiSettingsDataSource = createLocalStorageAISettingsDataSource();
const aiSettingsRepository = createAISettingsRepository(aiSettingsDataSource);
const getStoredApiKeyUseCase = createGetStoredApiKeyUseCase(aiSettingsRepository);
const saveApiKeyUseCase = createSaveApiKeyUseCase(aiSettingsRepository);
const getVideoContextUseCase = createGetVideoContextUseCase(aiSettingsRepository);
const saveVideoContextUseCase = createSaveVideoContextUseCase(aiSettingsRepository);

const canvasStateDataSource = createCanvasStateLocalStorageDataSource();
const textPropertiesDataSource = createTextPropertiesLocalStorageDataSource();
const backgroundRemovalDataSource = createBackgroundRemovalDataSource();
const fabricImageDataSource = createFabricImageDataSource();

const editorRepository: IEditorRepository = createEditorRepository({
    canvasStateDataSource,
    textPropertiesDataSource,
    backgroundRemovalDataSource,
    imageDataSource: fabricImageDataSource,
});

const addTextUseCase = createAddTextUseCase(editorRepository);
const addImageUseCase = createAddImageUseCase(editorRepository);
const replaceCanvasImageUseCase = createReplaceCanvasImageUseCase(editorRepository);
const canvasToBase64UseCase = createCanvasToBase64UseCase();
const downloadCanvasUseCase = createDownloadCanvasUseCase();
const saveCanvasStateUseCase = createSaveCanvasStateUseCase(editorRepository);
const loadCanvasStateUseCase = createLoadCanvasStateUseCase(editorRepository);
const clearCanvasStateUseCase = createClearCanvasStateUseCase(editorRepository);
const removeBackgroundUseCase = createRemoveBackgroundUseCase(editorRepository);
const loadTextPropertiesUseCase = createLoadTextPropertiesUseCase(editorRepository);
const saveTextPropertiesUseCase = createSaveTextPropertiesUseCase(editorRepository);

export interface DIContainer {
    enhanceThumbnailUseCase: typeof enhanceThumbnailUseCase;
    aiRepository: IAIRepository;
    aiSettingsRepository: IAISettingsRepository;
    getStoredApiKeyUseCase: typeof getStoredApiKeyUseCase;
    saveApiKeyUseCase: typeof saveApiKeyUseCase;
    getVideoContextUseCase: typeof getVideoContextUseCase;
    saveVideoContextUseCase: typeof saveVideoContextUseCase;
    editorRepository: IEditorRepository;
    addTextUseCase: typeof addTextUseCase;
    addImageUseCase: typeof addImageUseCase;
    replaceCanvasImageUseCase: typeof replaceCanvasImageUseCase;
    canvasToBase64UseCase: typeof canvasToBase64UseCase;
    downloadCanvasUseCase: typeof downloadCanvasUseCase;
    saveCanvasStateUseCase: typeof saveCanvasStateUseCase;
    loadCanvasStateUseCase: typeof loadCanvasStateUseCase;
    clearCanvasStateUseCase: typeof clearCanvasStateUseCase;
    removeBackgroundUseCase: typeof removeBackgroundUseCase;
    loadTextPropertiesUseCase: typeof loadTextPropertiesUseCase;
    saveTextPropertiesUseCase: typeof saveTextPropertiesUseCase;
}

export const diContainer: DIContainer = {
    enhanceThumbnailUseCase,
    aiRepository,
    aiSettingsRepository,
    getStoredApiKeyUseCase,
    saveApiKeyUseCase,
    getVideoContextUseCase,
    saveVideoContextUseCase,
    editorRepository,
    addTextUseCase,
    addImageUseCase,
    replaceCanvasImageUseCase,
    canvasToBase64UseCase,
    downloadCanvasUseCase,
    saveCanvasStateUseCase,
    loadCanvasStateUseCase,
    clearCanvasStateUseCase,
    removeBackgroundUseCase,
    loadTextPropertiesUseCase,
    saveTextPropertiesUseCase,
};
