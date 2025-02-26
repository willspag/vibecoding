saveComposition: async function(composition) {
  try {
    // We need to create a serializable version of the composition
    // AudioBufferSourceNode objects cannot be cloned/serialized
    const serializableComposition = {
      ...composition,
      // Remove or convert non-serializable properties
      tracks: composition.tracks.map(track => ({
        ...track,
        // Don't include the actual AudioBufferSourceNode objects
        // Instead, store only the necessary data to recreate them
        buffer: track.buffer ? {
          duration: track.buffer.duration,
          length: track.buffer.length,
          sampleRate: track.buffer.sampleRate,
          // You might need to store the actual audio data as an array
          // This depends on your application's needs
        } : null,
        // Remove any other non-serializable properties
        source: null, // Don't try to save the AudioBufferSourceNode
      }))
    };
    
    await localforage.setItem(`composition_${composition.id}`, serializableComposition);
    return composition.id;
  } catch (error) {
    console.error("Error saving composition:", error);
    throw new Error(`Failed to save composition: ${error.message}`);
  }
} 