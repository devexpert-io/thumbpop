// Default text properties
export const DEFAULT_TEXT_PROPERTIES = {
  fontFamily: 'Impact',
  fontSize: 48,
  fill: '#FFFFFF',
  stroke: '#000000',
  strokeWidth: 2,
  angle: 0,
};

// Save text properties to localStorage
export const saveTextProperties = (properties: Partial<typeof DEFAULT_TEXT_PROPERTIES>) => {
  try {
    const currentProperties = loadTextProperties();
    const updatedProperties = { ...currentProperties, ...properties };
    localStorage.setItem('thumbnail_pro_text_properties', JSON.stringify(updatedProperties));
  } catch (error) {
    console.warn('Failed to save text properties to localStorage:', error);
  }
};

// Load text properties from localStorage
export const loadTextProperties = (): typeof DEFAULT_TEXT_PROPERTIES => {
  try {
    const savedData = localStorage.getItem('thumbnail_pro_text_properties');
    if (!savedData) return DEFAULT_TEXT_PROPERTIES;
    
    const parsed = JSON.parse(savedData);
    return { ...DEFAULT_TEXT_PROPERTIES, ...parsed };
  } catch (error) {
    console.warn('Failed to load text properties from localStorage:', error);
    return DEFAULT_TEXT_PROPERTIES;
  }
};