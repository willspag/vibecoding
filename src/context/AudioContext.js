import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { 
  saveComposition, 
  loadComposition, 
  autoSaveComposition, 
  hasAutoSave, 
  loadAutoSave, 
  clearAutoSave,
  getSettings,
  saveSettings
} from '../services/StorageService';

// Create context
const AudioContext = createContext();

// Custom hook to use the audio context
export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volumeState, setVolumeState] = useState(-10); // in decibels
  const [instruments, setInstruments] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [masterVolume, setMasterVolume] = useState(null);
  const [currentComposition, setCurrentComposition] = useState({
    id: null,
    title: 'Untitled Composition',
    createdAt: null,
    updatedAt: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // We're not using patterns state directly, but keeping it for future use
  // eslint-disable-next-line no-unused-vars
  const [patterns, setPatterns] = useState([]);
  const [effects, setEffects] = useState([]);
  
  // Refs for auto-save
  const autoSaveTimerRef = useRef(null);
  const lastAutoSaveRef = useRef(Date.now());
  
  // Load settings on mount
  useEffect(() => {
    const loadAppSettings = async () => {
      const appSettings = await getSettings();
      setSettings(appSettings);
      setBpm(appSettings.defaultBpm);
      setVolumeState(appSettings.defaultVolume);
    };
    
    loadAppSettings();
  }, []);
  
  // Check for auto-save on mount
  useEffect(() => {
    const checkAutoSave = async () => {
      if (await hasAutoSave()) {
        // We have an auto-save, but we'll let the user decide whether to load it
        // This will be handled by the UI
      }
    };
    
    checkAutoSave();
  }, []);

  // Initialize audio context
  const initializeAudio = async () => {
    if (isAudioInitialized) {
      console.log('Audio already initialized');
      return;
    }
    
    try {
      console.log('Initializing audio...');
      
      // Start audio context with a user gesture
      await Tone.start();
      console.log('Audio context started');
      
      // Create master volume control
      const newMasterVolume = new Tone.Volume(volumeState).toDestination();
      setMasterVolume(newMasterVolume);
      
      // Set initial BPM
      Tone.Transport.bpm.value = bpm;
      
      // Mark as initialized
      setIsAudioInitialized(true);
      console.log('Audio is ready');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  };

  // Update BPM when it changes
  useEffect(() => {
    if (isAudioInitialized) {
      Tone.Transport.bpm.value = bpm;
      setHasUnsavedChanges(true);
    }
  }, [bpm, isAudioInitialized]);

  // Update master volume when it changes
  useEffect(() => {
    if (masterVolume) {
      masterVolume.volume.value = volumeState;
      setHasUnsavedChanges(true);
    }
  }, [volumeState, masterVolume]);
  
  // Wrap performAutoSave in useCallback
  const performAutoSave = useCallback(async () => {
    try {
      // Don't auto-save if we're already saving or loading
      if (isSaving || isLoading) return;
      
      // Create a composition object
      const composition = {
        id: currentComposition.id,
        title: currentComposition.title,
        createdAt: currentComposition.createdAt,
        updatedAt: new Date().toISOString(),
        bpm,
        volume: volumeState,
        tracks: tracks.map(track => ({
          ...track,
          instrument: instruments.find(i => i.id === track.instrumentId)?.type || 'synth',
        })),
      };
      
      // Save to auto-save storage
      await autoSaveComposition(composition);
      
      // Update last auto-save time
      lastAutoSaveRef.current = Date.now();
      
      console.log('Auto-saved composition');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [isSaving, isLoading, currentComposition, bpm, volumeState, tracks, instruments]);
  
  // Set up auto-save
  useEffect(() => {
    if (!settings || !settings.autoSaveEnabled) return;
    
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
    
    // Set up new timer
    autoSaveTimerRef.current = setInterval(() => {
      // Only auto-save if there are unsaved changes and it's been at least 5 seconds since the last auto-save
      if (hasUnsavedChanges && Date.now() - lastAutoSaveRef.current > 5000) {
        performAutoSave();
      }
    }, settings.autoSaveInterval);
    
    // Clean up on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [settings, hasUnsavedChanges, performAutoSave]);

  // Toggle play/pause
  const togglePlay = async () => {
    // Make sure audio is initialized
    if (!isAudioInitialized) {
      const success = await initializeAudio();
      if (!success) {
        console.warn('Could not initialize audio');
        return;
      }
    }
    
    try {
      // Always ensure audio context is running
      await Tone.start();
      
      if (isPlaying) {
        // Pause
        Tone.Transport.pause();
        setIsPlaying(false);
        console.log('Playback paused');
      } else {
        // Resume or start
        console.log('Starting playback...');
        
        // Make sure we have at least one instrument
        if (instruments.length === 0) {
          console.log('Creating default instrument');
          createInstrument('synth');
        }
        
        // Make sure we have at least one track
        if (tracks.length === 0) {
          console.log('Creating default track');
          createTrack('Track 1');
        }
        
        // Start transport
        Tone.Transport.start();
        setIsPlaying(true);
        console.log('Playback started');
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  // Stop transport and reset to beginning
  const stop = () => {
    if (isAudioInitialized) {
      Tone.Transport.stop();
      setIsPlaying(false);
    }
  };

  // Create a new instrument
  const createInstrument = (type = 'synth', options = {}) => {
    // Make sure audio is initialized
    if (!isAudioInitialized) {
      console.warn('Audio not initialized. Initializing now...');
      initializeAudio();
      // Return a placeholder instrument that will be replaced once audio is initialized
      const placeholderId = `instrument-${Date.now()}`;
      const placeholderInstrument = {
        id: placeholderId,
        type,
        options,
        instance: null,
      };
      setInstruments(prev => [...prev, placeholderInstrument]);
      return placeholderInstrument;
    }
    
    try {
      // Create the instrument based on type
      let instance;
      
      switch(type) {
        case 'synth':
          instance = new Tone.Synth(options);
          break;
        case 'amSynth':
          instance = new Tone.AMSynth(options);
          break;
        case 'fmSynth':
          instance = new Tone.FMSynth(options);
          break;
        case 'membraneSynth':
          instance = new Tone.MembraneSynth(options);
          break;
        case 'metalSynth':
          instance = new Tone.MetalSynth(options);
          break;
        case 'pluckSynth':
          instance = new Tone.PluckSynth(options);
          break;
        default:
          instance = new Tone.Synth(options);
      }
      
      // Connect to master volume
      if (masterVolume) {
        instance.connect(masterVolume);
      } else {
        instance.toDestination();
      }
      
      // Create instrument object
      const newInstrument = {
        id: `instrument-${Date.now()}`,
        type,
        options,
        instance,
      };
      
      // Add to instruments array
      setInstruments(prev => [...prev, newInstrument]);
      
      // Mark as having unsaved changes
      setHasUnsavedChanges(true);
      
      return newInstrument;
    } catch (error) {
      console.error('Error creating instrument:', error);
      return null;
    }
  };

  // Remove an instrument
  const removeInstrument = (id) => {
    setInstruments(prev => {
      const instrument = prev.find(i => i.id === id);
      if (instrument) {
        instrument.instance.dispose();
      }
      setHasUnsavedChanges(true);
      return prev.filter(i => i.id !== id);
    });
  };

  // Create a new track
  const createTrack = (name = 'New Track', instrumentId = null) => {
    // If no instrument ID is provided, create a new instrument
    let actualInstrumentId = instrumentId;
    
    if (!actualInstrumentId) {
      const newInstrument = createInstrument('synth');
      actualInstrumentId = newInstrument.id;
    }
    
    // Create the track with all required properties
    const newTrack = {
      id: `track-${Date.now()}`,
      name,
      instrumentId: actualInstrumentId,
      muted: false,
      solo: false,
      volume: 0,
      patterns: [], // Initialize with empty patterns array
      effects: [],  // Initialize with empty effects array
    };
    
    // Add to tracks array
    setTracks(prev => [...prev, newTrack]);
    
    // If this is the first track, set it as current
    if (tracks.length === 0) {
      setCurrentTrack(newTrack.id);
    }
    
    // Mark as having unsaved changes
    setHasUnsavedChanges(true);
    
    return newTrack;
  };

  // Remove a track
  const removeTrack = (id) => {
    setTracks(prev => {
      const filteredTracks = prev.filter(t => t.id !== id);
      
      // If we're removing the current track, select another one if available
      if (id === currentTrack && filteredTracks.length > 0) {
        setCurrentTrack(filteredTracks[0].id);
      } else if (filteredTracks.length === 0) {
        setCurrentTrack(null);
      }
      
      setHasUnsavedChanges(true);
      return filteredTracks;
    });
  };

  // Add an effect to a track
  const addEffect = (trackId, type, options = {}) => {
    // Make sure audio is initialized
    if (!isAudioInitialized) {
      console.warn('Audio not initialized');
      return null;
    }
    
    // Find the track
    const track = tracks.find(t => t.id === trackId);
    if (!track) {
      console.warn(`Track ${trackId} not found`);
      return null;
    }
    
    // Find the instrument
    const instrument = instruments.find(i => i.id === track.instrumentId);
    if (!instrument) {
      console.warn(`Instrument for track ${trackId} not found`);
      return null;
    }
    
    try {
      // Create the effect based on type
      let effect;
      
      switch(type) {
        case 'reverb':
          effect = new Tone.Reverb(options);
          break;
        case 'delay':
          effect = new Tone.FeedbackDelay(options);
          break;
        case 'distortion':
          effect = new Tone.Distortion(options);
          break;
        case 'chorus':
          effect = new Tone.Chorus(options);
          break;
        default:
          effect = new Tone.Reverb(options);
      }
      
      // Wait for the effect to be ready (some effects like Reverb need to generate buffers)
      effect.toDestination();
      
      // Create effect object
      const newEffect = {
        id: `effect-${Date.now()}`,
        trackId,
        type,
        options,
        instance: effect,
      };
      
      // Add to effects array
      setEffects(prev => [...prev, newEffect]);
      
      // Reconnect the instrument through the effect chain
      reconnectEffectChain(trackId);
      
      // Mark as having unsaved changes
      setHasUnsavedChanges(true);
      
      return newEffect;
    } catch (error) {
      console.error('Error adding effect:', error);
      return null;
    }
  };

  // Helper function to reconnect the effect chain for a track
  const reconnectEffectChain = (trackId) => {
    // Find the track
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    // Find the instrument
    const instrument = instruments.find(i => i.id === track.instrumentId);
    if (!instrument || !instrument.instance) return;
    
    // Find all effects for this track
    const trackEffects = effects.filter(e => e.trackId === trackId);
    
    // Disconnect the instrument from any previous connections
    try {
      instrument.instance.disconnect();
    } catch (e) {
      console.error('Failed to disconnect instrument:', e);
    }
    
    // If no effects, connect directly to destination
    if (trackEffects.length === 0) {
      try {
        instrument.instance.connect(Tone.Destination);
      } catch (e) {
        console.error('Failed to connect instrument to destination:', e);
      }
      return;
    }
    
    // Connect the instrument to the first effect
    try {
      instrument.instance.connect(trackEffects[0].instance);
    } catch (e) {
      console.error('Failed to connect instrument to first effect:', e);
    }
    
    // Connect effects in chain
    for (let i = 0; i < trackEffects.length - 1; i++) {
      try {
        trackEffects[i].instance.disconnect();
        trackEffects[i].instance.connect(trackEffects[i + 1].instance);
      } catch (e) {
        console.error(`Failed to connect effect ${i} to effect ${i+1}:`, e);
      }
    }
    
    // Connect the last effect to the destination
    try {
      trackEffects[trackEffects.length - 1].instance.disconnect();
      trackEffects[trackEffects.length - 1].instance.connect(Tone.Destination);
    } catch (e) {
      console.error('Failed to connect last effect to destination:', e);
    }
  };

  // Remove an effect from a track
  const removeEffect = (trackId, effectId) => {
    // Find the effect
    const effect = effects.find(e => e.id === effectId);
    if (!effect) return;
    
    // Dispose of the effect
    if (effect.instance) {
      try {
        effect.instance.dispose();
      } catch (e) {
        console.error('Failed to dispose effect:', e);
      }
    }
    
    // Remove from effects array
    setEffects(prev => prev.filter(e => e.id !== effectId));
    
    // Reconnect the effect chain
    reconnectEffectChain(trackId);
    
    // Mark as having unsaved changes
    setHasUnsavedChanges(true);
  };

  // Create a pattern for a track
  const createPattern = (trackId, notes = []) => {
    const newPattern = {
      id: Date.now().toString(),
      notes,
      sequence: null
    };
    
    setTracks(prev => {
      return prev.map(track => {
        if (track.id === trackId) {
          // Create a Tone.js sequence for this pattern
          const instrument = instruments.find(i => i.id === track.instrumentId);
          if (instrument) {
            const sequence = new Tone.Sequence(
              (time, note) => {
                if (note !== null) {
                  instrument.instance.triggerAttackRelease(note.pitch, note.duration, time);
                }
              },
              notes.map(n => n.enabled ? n : null),
              '16n'
            ).start(0);
            
            newPattern.sequence = sequence;
          }
          
          return {
            ...track,
            patterns: [...track.patterns, newPattern]
          };
        }
        return track;
      });
    });
    
    return newPattern;
  };

  // Update a pattern
  const updatePattern = (trackId, patternId, notes) => {
    setTracks(prev => {
      return prev.map(track => {
        if (track.id === trackId) {
          return {
            ...track,
            patterns: track.patterns.map(pattern => {
              if (pattern.id === patternId) {
                // Update the sequence
                if (pattern.sequence) {
                  pattern.sequence.dispose();
                }
                
                const instrument = instruments.find(i => i.id === track.instrumentId);
                if (instrument) {
                  const sequence = new Tone.Sequence(
                    (time, note) => {
                      if (note !== null) {
                        instrument.instance.triggerAttackRelease(note.pitch, note.duration, time);
                      }
                    },
                    notes.map(n => n.enabled ? n : null),
                    '16n'
                  ).start(0);
                  
                  return {
                    ...pattern,
                    notes,
                    sequence
                  };
                }
              }
              return pattern;
            })
          };
        }
        return track;
      });
    });
  };

  // Remove a pattern
  const removePattern = (trackId, patternId) => {
    setTracks(prev => {
      return prev.map(track => {
        if (track.id === trackId) {
          const patternToRemove = track.patterns.find(p => p.id === patternId);
          if (patternToRemove && patternToRemove.sequence) {
            patternToRemove.sequence.dispose();
          }
          
          return {
            ...track,
            patterns: track.patterns.filter(p => p.id !== patternId)
          };
        }
        return track;
      });
    });
  };

  // Save the current composition
  const saveCurrentComposition = async (title = currentComposition.title) => {
    try {
      setIsSaving(true);
      
      // Create a composition object
      const composition = {
        id: currentComposition.id,
        title,
        createdAt: currentComposition.createdAt,
        updatedAt: new Date().toISOString(),
        bpm,
        volume: volumeState,
        tracks: tracks.map(track => ({
          ...track,
          instrument: instruments.find(i => i.id === track.instrumentId)?.type || 'synth',
        })),
      };
      
      // Save the composition
      const id = await saveComposition(composition);
      
      // Update the current composition
      setCurrentComposition({
        id,
        title,
        createdAt: composition.createdAt,
        updatedAt: composition.updatedAt,
      });
      
      // Clear auto-save since we've saved properly
      await clearAutoSave();
      
      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      
      setIsSaving(false);
      return id;
    } catch (error) {
      console.error('Error saving composition:', error);
      setIsSaving(false);
      throw error;
    }
  };

  // Load a composition by ID
  const loadCompositionById = async (id) => {
    try {
      setIsLoading(true);
      
      // Load the composition
      const composition = await loadComposition(id);
      
      if (!composition) {
        throw new Error('Composition not found');
      }
      
      // Stop any playing audio
      if (isPlaying) {
        Tone.Transport.stop();
        setIsPlaying(false);
      }
      
      // Dispose of all current instruments
      instruments.forEach(instrument => {
        instrument.instance.dispose();
      });
      
      // Initialize audio if not already initialized
      if (!isAudioInitialized) {
        await initializeAudio();
      }
      
      // Set BPM and volume
      setBpm(composition.bpm || 120);
      setVolumeState(composition.volume || -10);
      
      // Create new instruments for each track
      const newInstruments = [];
      
      // Create tracks
      const newTracks = composition.tracks.map(track => {
        // Create instrument for this track
        const instrumentType = track.instrument || 'synth';
        const instrument = createInstrument(instrumentType, track.instrumentOptions || {});
        newInstruments.push(instrument);
        
        // Return the track with the new instrument ID
        return {
          ...track,
          instrumentId: instrument.id,
        };
      });
      
      // Set the new instruments and tracks
      setInstruments(newInstruments);
      setTracks(newTracks);
      
      // Set the current track to the first one if available
      if (newTracks.length > 0) {
        setCurrentTrack(newTracks[0].id);
      } else {
        setCurrentTrack(null);
      }
      
      // Update the current composition
      setCurrentComposition({
        id: composition.id,
        title: composition.title,
        createdAt: composition.createdAt,
        updatedAt: composition.updatedAt,
      });
      
      // Reset unsaved changes flag
      setHasUnsavedChanges(false);
      
      setIsLoading(false);
      return composition;
    } catch (error) {
      console.error('Error loading composition:', error);
      setIsLoading(false);
      throw error;
    }
  };
  
  // Load the auto-saved composition
  const loadAutoSavedComposition = async () => {
    try {
      setIsLoading(true);
      
      // Load the auto-saved composition
      const composition = await loadAutoSave();
      
      if (!composition) {
        throw new Error('No auto-saved composition found');
      }
      
      // Stop any playing audio
      if (isPlaying) {
        Tone.Transport.stop();
        setIsPlaying(false);
      }
      
      // Dispose of all current instruments
      instruments.forEach(instrument => {
        instrument.instance.dispose();
      });
      
      // Initialize audio if not already initialized
      if (!isAudioInitialized) {
        await initializeAudio();
      }
      
      // Set BPM and volume
      setBpm(composition.bpm || 120);
      setVolumeState(composition.volume || -10);
      
      // Create new instruments for each track
      const newInstruments = [];
      
      // Create tracks
      const newTracks = composition.tracks.map(track => {
        // Create instrument for this track
        const instrumentType = track.instrument || 'synth';
        const instrument = createInstrument(instrumentType, track.instrumentOptions || {});
        newInstruments.push(instrument);
        
        // Return the track with the new instrument ID
        return {
          ...track,
          instrumentId: instrument.id,
        };
      });
      
      // Set the new instruments and tracks
      setInstruments(newInstruments);
      setTracks(newTracks);
      
      // Set the current track to the first one if available
      if (newTracks.length > 0) {
        setCurrentTrack(newTracks[0].id);
      } else {
        setCurrentTrack(null);
      }
      
      // Update the current composition
      setCurrentComposition({
        id: composition.id,
        title: composition.title,
        createdAt: composition.createdAt,
        updatedAt: composition.updatedAt,
      });
      
      // Set unsaved changes flag since this is from auto-save
      setHasUnsavedChanges(true);
      
      setIsLoading(false);
      return composition;
    } catch (error) {
      console.error('Error loading auto-saved composition:', error);
      setIsLoading(false);
      throw error;
    }
  };

  // Create a new composition
  const createNewComposition = () => {
    // Stop any playing audio
    if (isPlaying) {
      Tone.Transport.stop();
      setIsPlaying(false);
    }
    
    // Dispose of all current instruments
    instruments.forEach(instrument => {
      instrument.instance.dispose();
    });
    
    // Reset state
    setInstruments([]);
    setTracks([]);
    setCurrentTrack(null);
    setBpm(settings?.defaultBpm || 120);
    setVolumeState(settings?.defaultVolume || -10);
    
    // Reset current composition
    setCurrentComposition({
      id: null,
      title: 'Untitled Composition',
      createdAt: null,
      updatedAt: null,
    });
    
    // Reset unsaved changes flag
    setHasUnsavedChanges(false);
  };
  
  // Update app settings
  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };
      
      // Save to storage
      await saveSettings(updatedSettings);
      
      // Update state
      setSettings(updatedSettings);
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Dispose of all instruments and effects
      instruments.forEach(instrument => {
        if (instrument && instrument.instance) {
          try {
            instrument.instance.dispose();
          } catch (error) {
            console.error('Error disposing instrument:', error);
          }
        }
      });
      
      tracks.forEach(track => {
        // Check if track.effects exists before trying to iterate over it
        if (track.effects && Array.isArray(track.effects)) {
          track.effects.forEach(effect => {
            if (effect && effect.instance) {
              try {
                effect.instance.dispose();
              } catch (error) {
                console.error('Error disposing effect:', error);
              }
            }
          });
        }
        
        // Check if track.patterns exists before trying to iterate over it
        if (track.patterns && Array.isArray(track.patterns)) {
          track.patterns.forEach(pattern => {
            if (pattern && pattern.sequence) {
              try {
                pattern.sequence.dispose();
              } catch (error) {
                console.error('Error disposing pattern sequence:', error);
              }
            }
          });
        }
      });
      
      if (masterVolume) {
        try {
          masterVolume.dispose();
        } catch (error) {
          console.error('Error disposing master volume:', error);
        }
      }
      
      try {
        Tone.Transport.stop();
        Tone.Transport.cancel();
      } catch (error) {
        console.error('Error stopping transport:', error);
      }
    };
  }, [instruments, tracks, masterVolume]);

  // Set volume
  const setVolume = (newVolume) => {
    // Update state
    setVolumeState(newVolume);
    
    // Update master volume if initialized
    if (masterVolume) {
      try {
        masterVolume.volume.value = newVolume;
      } catch (error) {
        console.error('Error setting master volume:', error);
      }
    }
    
    // Mark as having unsaved changes
    setHasUnsavedChanges(true);
  };

  // Context value
  const value = {
    isAudioInitialized,
    isPlaying,
    bpm,
    setBpm,
    volume: volumeState,
    setVolume,
    togglePlay,
    stop,
    instruments,
    createInstrument,
    removeInstrument,
    tracks,
    createTrack,
    removeTrack,
    currentTrack,
    setCurrentTrack,
    currentComposition,
    saveCurrentComposition,
    loadCompositionById,
    createNewComposition,
    isSaving,
    isLoading,
    hasUnsavedChanges,
    settings,
    updateSettings,
    loadAutoSavedComposition,
    hasAutoSave,
    initializeAudio,
    createPattern,
    updatePattern,
    removePattern,
    addEffect,
    removeEffect,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}; 