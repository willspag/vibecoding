// Add this function to ensure AudioContext starts after user interaction
function ensureAudioContextStarted() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('AudioContext resumed successfully');
    }).catch(err => {
      console.error('Failed to resume AudioContext:', err);
    });
  }
}

// Modify your initialization to wait for user interaction
function initializeAudio() {
  console.log('Initializing audio...');
  
  // Create the context but don't start it yet
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Add event listeners to the document for user interaction
  const userInteractionEvents = ['mousedown', 'keydown', 'touchstart'];
  const startAudioOnUserInteraction = () => {
    ensureAudioContextStarted();
    // Remove the event listeners once audio is started
    userInteractionEvents.forEach(event => {
      document.removeEventListener(event, startAudioOnUserInteraction);
    });
  };
  
  userInteractionEvents.forEach(event => {
    document.addEventListener(event, startAudioOnUserInteraction);
  });
  
  // Rest of your initialization code
  // ... existing code ...
}

async function saveCurrentComposition() {
  try {
    // Make sure we're not trying to save AudioBufferSourceNode objects directly
    const compositionToSave = {
      id: currentComposition.id || generateUniqueId(),
      name: currentComposition.name || 'Untitled Composition',
      tracks: currentComposition.tracks.map(track => ({
        id: track.id,
        name: track.name,
        volume: track.volume,
        pan: track.pan,
        muted: track.muted,
        solo: track.solo,
        // Store audio data in a serializable format
        // This depends on how you're handling audio data
        audioData: track.audioData, // Assuming you have serializable audio data
        // Don't include non-serializable objects
        source: null,
        buffer: null,
        // Include any other serializable properties you need
      })),
      // Include other composition properties as needed
    };
    
    const savedId = await StorageService.saveComposition(compositionToSave);
    console.log(`Composition saved with ID: ${savedId}`);
    return savedId;
  } catch (error) {
    console.error("Error saving composition:", error);
    throw error;
  }
} 