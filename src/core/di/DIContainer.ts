import { IAIRepository } from '../../features/ai/types';
import { createEnhanceThumbnailUseCase } from '../../features/ai/use-cases/EnhanceThumbnail.usecase';
import { geminiAIDataSource } from '../../features/ai/services/data-sources/Gemini.datasource';
import { createAIRepository } from '../../features/ai/services/AI.repository';
import { ISettingsRepository } from '../../features/settings/types';
import { createLocalStorageSettingsDataSource } from '../../features/settings/services/data-sources/LocalStorageSettings.datasource';
import { createSettingsRepository } from '../../features/settings/services/Settings.repository';
import { createGetStoredApiKeyUseCase } from '../../features/settings/use-cases/GetStoredApiKey.usecase';
import { createSaveApiKeyUseCase } from '../../features/settings/use-cases/SaveApiKey.usecase';
import { createGetVideoContextUseCase } from '../../features/settings/use-cases/GetVideoContext.usecase';
import { createSaveVideoContextUseCase } from '../../features/settings/use-cases/SaveVideoContext.usecase';
import { createCanvasStateLocalStorageDataSource } from '../../features/editor/services/data-sources/CanvasStateLocalStorage.datasource';
import { createTextPropertiesLocalStorageDataSource } from '../../features/editor/services/data-sources/TextPropertiesLocalStorage.datasource';
import { createFabricImageDataSource } from '../../features/editor/services/data-sources/FabricImage.datasource';
import { createEditorRepository } from '../../features/editor/services/Editor.repository';
import { IEditorRepository } from '../../features/editor/types';
import { IBackgroundRemovalRepository } from '../../features/background-removal/types';
import { createBackgroundRemovalDataSource } from '../../features/background-removal/services/data-sources/BackgroundRemoval.datasource';
import { createBackgroundRemovalRepository } from '../../features/background-removal/services/BackgroundRemoval.repository';
import { createRemoveBackgroundUseCase } from '../../features/background-removal/use-cases/RemoveBackground.usecase';
import { createAddTextUseCase } from '../../features/editor/use-cases/AddText.usecase';
import { createAddImageUseCase } from '../../features/editor/use-cases/AddImage.usecase';
import { createReplaceCanvasImageUseCase } from '../../features/editor/use-cases/ReplaceCanvasImage.usecase';
import { createCanvasToBase64UseCase } from '../../features/editor/use-cases/CanvasToBase64.usecase';
import { createDownloadCanvasUseCase } from '../../features/editor/use-cases/DownloadCanvas.usecase';
import { createSaveCanvasStateUseCase } from '../../features/editor/use-cases/SaveCanvasState.usecase';
import { createLoadCanvasStateUseCase } from '../../features/editor/use-cases/LoadCanvasState.usecase';
import { createClearCanvasStateUseCase } from '../../features/editor/use-cases/ClearCanvasState.usecase';
import { createLoadTextPropertiesUseCase } from '../../features/editor/use-cases/LoadTextProperties.usecase';
import { createSaveTextPropertiesUseCase } from '../../features/editor/use-cases/SaveTextProperties.usecase';

const aiRepository = createAIRepository(geminiAIDataSource);
const enhanceThumbnailUseCase = createEnhanceThumbnailUseCase(aiRepository);

const settingsDataSource = createLocalStorageSettingsDataSource();
const settingsRepository = createSettingsRepository(settingsDataSource);
const getStoredApiKeyUseCase = createGetStoredApiKeyUseCase(settingsRepository);
const saveApiKeyUseCase = createSaveApiKeyUseCase(settingsRepository);
const getVideoContextUseCase = createGetVideoContextUseCase(settingsRepository);
const saveVideoContextUseCase = createSaveVideoContextUseCase(settingsRepository);

const canvasStateDataSource = createCanvasStateLocalStorageDataSource();
const textPropertiesDataSource = createTextPropertiesLocalStorageDataSource();
const fabricImageDataSource = createFabricImageDataSource();
const backgroundRemovalDataSource = createBackgroundRemovalDataSource();
const backgroundRemovalRepository: IBackgroundRemovalRepository = createBackgroundRemovalRepository(
    backgroundRemovalDataSource
);

const editorRepository: IEditorRepository = createEditorRepository({
    canvasStateDataSource,
    textPropertiesDataSource,
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
const removeBackgroundUseCase = createRemoveBackgroundUseCase(backgroundRemovalRepository);
const loadTextPropertiesUseCase = createLoadTextPropertiesUseCase(editorRepository);
const saveTextPropertiesUseCase = createSaveTextPropertiesUseCase(editorRepository);

export interface DIContainer {
    enhanceThumbnailUseCase: typeof enhanceThumbnailUseCase;
    aiRepository: IAIRepository;
    settingsRepository: ISettingsRepository;
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
    settingsRepository,
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
