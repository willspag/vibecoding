import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Initialize localforage
localforage.config({
  name: 'SoundScape',
  storeName: 'compositions',
  description: 'Storage for SoundScape music compositions',
});

// Key for storing the list of compositions
const COMPOSITIONS_LIST_KEY = 'soundscape_compositions_list';
const AUTO_SAVE_KEY = 'soundscape_autosave';
const SETTINGS_KEY = 'soundscape_settings';

// Default settings
const DEFAULT_SETTINGS = {
  autoSaveEnabled: true,
  autoSaveInterval: 60000, // 1 minute
  maxCompositions: 50,
  theme: 'auto',
  defaultBpm: 120,
  defaultVolume: -10,
};

/**
 * Save a composition to local storage
 * @param {Object} composition - The composition to save
 * @returns {Promise<string>} - The ID of the saved composition
 */
export const saveComposition = async (composition) => {
  try {
    // If no ID is provided, generate one
    if (!composition.id) {
      composition.id = uuidv4();
    }
    
    // Add or update timestamp
    composition.updatedAt = new Date().toISOString();
    if (!composition.createdAt) {
      composition.createdAt = composition.updatedAt;
    }
    
    // Generate a thumbnail if not provided
    if (!composition.thumbnail) {
      composition.thumbnail = generateThumbnail(composition);
    }
    
    // Check storage quota before saving
    await ensureStorageSpace();
    
    // Save the composition data
    await localforage.setItem(`composition_${composition.id}`, composition);
    
    // Update the list of compositions
    const compositionsList = await getCompositionsList();
    
    // Check if the composition is already in the list
    const existingIndex = compositionsList.findIndex(item => item.id === composition.id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      compositionsList[existingIndex] = {
        id: composition.id,
        title: composition.title,
        updatedAt: composition.updatedAt,
        createdAt: composition.createdAt,
        thumbnail: composition.thumbnail || null,
      };
    } else {
      // Add new entry
      compositionsList.push({
        id: composition.id,
        title: composition.title,
        updatedAt: composition.updatedAt,
        createdAt: composition.createdAt,
        thumbnail: composition.thumbnail || null,
      });
    }
    
    // Sort compositions by updated date (newest first)
    compositionsList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Save the updated list
    await localforage.setItem(COMPOSITIONS_LIST_KEY, compositionsList);
    
    return composition.id;
  } catch (error) {
    console.error('Error saving composition:', error);
    throw new Error(`Failed to save composition: ${error.message}`);
  }
};

/**
 * Load a composition from local storage
 * @param {string} id - The ID of the composition to load
 * @returns {Promise<Object|null>} - The loaded composition or null if not found
 */
export const loadComposition = async (id) => {
  try {
    const composition = await localforage.getItem(`composition_${id}`);
    return composition;
  } catch (error) {
    console.error('Error loading composition:', error);
    throw new Error(`Failed to load composition: ${error.message}`);
  }
};

/**
 * Delete a composition from local storage
 * @param {string} id - The ID of the composition to delete
 * @returns {Promise<void>}
 */
export const deleteComposition = async (id) => {
  try {
    // Remove the composition data
    await localforage.removeItem(`composition_${id}`);
    
    // Update the list of compositions
    const compositionsList = await getCompositionsList();
    const updatedList = compositionsList.filter(item => item.id !== id);
    await localforage.setItem(COMPOSITIONS_LIST_KEY, updatedList);
  } catch (error) {
    console.error('Error deleting composition:', error);
    throw new Error(`Failed to delete composition: ${error.message}`);
  }
};

/**
 * Get the list of all compositions
 * @returns {Promise<Array>} - The list of compositions
 */
export const getCompositionsList = async () => {
  try {
    const list = await localforage.getItem(COMPOSITIONS_LIST_KEY);
    return list || [];
  } catch (error) {
    console.error('Error getting compositions list:', error);
    throw new Error(`Failed to get compositions list: ${error.message}`);
  }
};

/**
 * Clear all compositions from local storage
 * @returns {Promise<void>}
 */
export const clearAllCompositions = async () => {
  try {
    const compositionsList = await getCompositionsList();
    
    // Remove all composition data
    for (const item of compositionsList) {
      await localforage.removeItem(`composition_${item.id}`);
    }
    
    // Clear the list
    await localforage.setItem(COMPOSITIONS_LIST_KEY, []);
  } catch (error) {
    console.error('Error clearing compositions:', error);
    throw new Error(`Failed to clear compositions: ${error.message}`);
  }
};

/**
 * Export a composition to a JSON file
 * @param {string} id - The ID of the composition to export
 * @returns {Promise<Blob>} - A Blob containing the composition data
 */
export const exportComposition = async (id) => {
  try {
    const composition = await loadComposition(id);
    if (!composition) {
      throw new Error('Composition not found');
    }
    
    const blob = new Blob([JSON.stringify(composition, null, 2)], { type: 'application/json' });
    return blob;
  } catch (error) {
    console.error('Error exporting composition:', error);
    throw new Error(`Failed to export composition: ${error.message}`);
  }
};

/**
 * Import a composition from a JSON file
 * @param {File} file - The JSON file to import
 * @returns {Promise<string>} - The ID of the imported composition
 */
export const importComposition = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const composition = JSON.parse(event.target.result);
          
          // Generate a new ID to avoid conflicts
          composition.id = uuidv4();
          composition.title = `${composition.title} (Imported)`;
          
          // Save the imported composition
          const id = await saveComposition(composition);
          resolve(id);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Error importing composition:', error);
    throw new Error(`Failed to import composition: ${error.message}`);
  }
};

/**
 * Save the current composition as an auto-save
 * @param {Object} composition - The composition to auto-save
 * @returns {Promise<void>}
 */
export const autoSaveComposition = async (composition) => {
  try {
    // Make a copy of the composition to avoid modifying the original
    const autoSaveData = {
      composition: { ...composition },
      timestamp: new Date().toISOString(),
    };
    
    await localforage.setItem(AUTO_SAVE_KEY, autoSaveData);
  } catch (error) {
    console.error('Error auto-saving composition:', error);
    // Don't throw here to prevent disrupting the user experience
  }
};

/**
 * Check if an auto-save exists
 * @returns {Promise<boolean>} - Whether an auto-save exists
 */
export const hasAutoSave = async () => {
  try {
    const autoSave = await localforage.getItem(AUTO_SAVE_KEY);
    return !!autoSave;
  } catch (error) {
    console.error('Error checking auto-save:', error);
    return false;
  }
};

/**
 * Load the auto-saved composition
 * @returns {Promise<Object|null>} - The auto-saved composition or null if not found
 */
export const loadAutoSave = async () => {
  try {
    const autoSave = await localforage.getItem(AUTO_SAVE_KEY);
    return autoSave ? autoSave.composition : null;
  } catch (error) {
    console.error('Error loading auto-save:', error);
    return null;
  }
};

/**
 * Clear the auto-saved composition
 * @returns {Promise<void>}
 */
export const clearAutoSave = async () => {
  try {
    await localforage.removeItem(AUTO_SAVE_KEY);
  } catch (error) {
    console.error('Error clearing auto-save:', error);
  }
};

/**
 * Get the app settings
 * @returns {Promise<Object>} - The app settings
 */
export const getSettings = async () => {
  try {
    const settings = await localforage.getItem(SETTINGS_KEY);
    return settings || DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save the app settings
 * @param {Object} settings - The settings to save
 * @returns {Promise<void>}
 */
export const saveSettings = async (settings) => {
  try {
    await localforage.setItem(SETTINGS_KEY, {
      ...DEFAULT_SETTINGS,
      ...settings,
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error(`Failed to save settings: ${error.message}`);
  }
};

/**
 * Check available storage space and remove old compositions if needed
 * @returns {Promise<void>}
 */
export const ensureStorageSpace = async () => {
  try {
    const settings = await getSettings();
    const compositionsList = await getCompositionsList();
    
    // If we have more compositions than the maximum allowed, remove the oldest ones
    if (compositionsList.length >= settings.maxCompositions) {
      // Sort by updated date (oldest first)
      const sortedList = [...compositionsList].sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );
      
      // Calculate how many compositions to remove
      const removeCount = Math.max(1, Math.ceil(compositionsList.length * 0.1)); // Remove at least 1, or 10% of total
      
      // Get the IDs of compositions to remove
      const idsToRemove = sortedList.slice(0, removeCount).map(item => item.id);
      
      // Remove the compositions
      for (const id of idsToRemove) {
        await deleteComposition(id);
      }
    }
  } catch (error) {
    console.error('Error ensuring storage space:', error);
  }
};

/**
 * Generate a simple thumbnail representation of a composition
 * @param {Object} composition - The composition to generate a thumbnail for
 * @returns {string} - A data URL for the thumbnail
 */
const generateThumbnail = (composition) => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 100;
    const height = 60;
    
    canvas.width = width;
    canvas.height = height;
    
    // Fill background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Draw a simple representation of the tracks and patterns
    if (composition.tracks && composition.tracks.length > 0) {
      const trackHeight = height / Math.min(composition.tracks.length, 4);
      
      composition.tracks.slice(0, 4).forEach((track, trackIndex) => {
        // Use a different color for each track
        const colors = ['#3182CE', '#38A169', '#DD6B20', '#805AD5'];
        ctx.fillStyle = colors[trackIndex % colors.length];
        
        // Draw a representation of the patterns
        if (track.patterns && track.patterns.length > 0) {
          track.patterns.forEach(pattern => {
            if (pattern.notes && pattern.notes.length > 0) {
              pattern.notes.forEach(note => {
                const x = (note.time / 16) * width;
                const noteHeight = trackHeight * 0.6;
                ctx.fillRect(x, trackIndex * trackHeight + (trackHeight - noteHeight) / 2, 3, noteHeight);
              });
            }
          });
        }
      });
    }
    
    // Return the canvas as a data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}; 