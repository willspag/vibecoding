import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  useColorModeValue,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Switch,
} from '@chakra-ui/react';
import { FaRobot, FaRandom, FaMusic, FaInfoCircle, FaCheck, FaTimes, FaMagic, FaGuitar, FaDrum, FaRegLightbulb } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';

// Define musical scales
const SCALES = {
  'major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'minor': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'pentatonic': ['C', 'D', 'E', 'G', 'A'],
  'blues': ['C', 'Eb', 'F', 'F#', 'G', 'Bb'],
  'chromatic': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  'dorian': ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
  'phrygian': ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'lydian': ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
  'mixolydian': ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
  'locrian': ['C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb'],
};

// Define musical genres with their typical characteristics
const GENRES = {
  'ambient': {
    bpm: 80,
    scale: 'pentatonic',
    complexity: 0.3,
    density: 0.2,
  },
  'electronic': {
    bpm: 120,
    scale: 'minor',
    complexity: 0.6,
    density: 0.5,
  },
  'jazz': {
    bpm: 100,
    scale: 'blues',
    complexity: 0.8,
    density: 0.4,
  },
  'classical': {
    bpm: 90,
    scale: 'major',
    complexity: 0.7,
    density: 0.5,
  },
  'rock': {
    bpm: 110,
    scale: 'pentatonic',
    complexity: 0.5,
    density: 0.6,
  },
  'lofi': {
    bpm: 85,
    scale: 'dorian',
    complexity: 0.4,
    density: 0.3,
  },
  'techno': {
    bpm: 130,
    scale: 'minor',
    complexity: 0.5,
    density: 0.7,
  },
  'trap': {
    bpm: 140,
    scale: 'minor',
    complexity: 0.4,
    density: 0.6,
  },
  'funk': {
    bpm: 115,
    scale: 'mixolydian',
    complexity: 0.7,
    density: 0.6,
  },
  'cinematic': {
    bpm: 75,
    scale: 'lydian',
    complexity: 0.6,
    density: 0.4,
  },
};

const AIComposer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    currentTrack,
    tracks,
    createPattern,
    updatePattern,
    setBpm,
  } = useAudio();
  
  // AI composition parameters
  const [genre, setGenre] = useState('electronic');
  const [scale, setScale] = useState('minor');
  const [complexity, setComplexity] = useState(0.5);
  const [density, setDensity] = useState(0.5);
  const [rootNote, setRootNote] = useState('C');
  const [octave, setOctave] = useState(4);
  const [generationMethod, setGenerationMethod] = useState('pattern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [harmonyEnabled, setHarmonyEnabled] = useState(false);
  
  // Get the current track
  const track = tracks.find(t => t.id === currentTrack);
  
  // Get current track's patterns
  const currentPatterns = track ? track.patterns : [];
  const [selectedPatternId, setSelectedPatternId] = useState(null);
  
  // Update selected pattern when track changes
  useEffect(() => {
    // Make sure track exists and has a patterns array before trying to access it
    if (track && Array.isArray(track.patterns) && track.patterns.length > 0) {
      setSelectedPatternId(track.patterns[0].id);
    } else {
      setSelectedPatternId(null);
    }
  }, [track]);
  
  // Apply genre presets
  const applyGenrePreset = (selectedGenre) => {
    setGenre(selectedGenre);
    const preset = GENRES[selectedGenre];
    setScale(preset.scale);
    setComplexity(preset.complexity);
    setDensity(preset.density);
    setBpm(preset.bpm);
  };
  
  // Generate a melody based on the selected parameters
  const generateMelody = () => {
    if (!track) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      // Get the scale notes based on the root note and octave
      const scaleNotes = getScaleNotes(rootNote, octave, scale);
      
      // Generate a pattern based on the parameters
      const pattern = [];
      const steps = 16; // Number of steps in the sequencer
      
      // Different generation methods
      if (generationMethod === 'pattern') {
        // Generate a repeating pattern
        const patternLength = Math.max(2, Math.floor(4 * complexity));
        const basePattern = generateBasePattern(patternLength, density, scaleNotes);
        
        // Repeat the pattern to fill the steps
        for (let i = 0; i < steps; i++) {
          const patternIndex = i % patternLength;
          if (basePattern[patternIndex]) {
            pattern.push({
              pitch: basePattern[patternIndex],
              time: i,
              duration: '8n',
              velocity: 0.7 + (Math.random() * 0.3), // Random velocity between 0.7 and 1.0
              enabled: true,
            });
          }
        }
      } else if (generationMethod === 'random') {
        // Generate completely random notes
        for (let i = 0; i < steps; i++) {
          // Determine if a note should be placed at this step based on density
          if (Math.random() < density) {
            // Select a random note from the scale
            const noteIndex = Math.floor(Math.random() * scaleNotes.length);
            pattern.push({
              pitch: scaleNotes[noteIndex],
              time: i,
              duration: '8n',
              velocity: 0.7 + (Math.random() * 0.3),
              enabled: true,
            });
          }
        }
      } else if (generationMethod === 'arpeggio') {
        // Generate an arpeggio pattern
        // For arpeggios, we'll use the 1st, 3rd, and 5th notes of the scale
        const arpeggioNotes = [
          scaleNotes[0], // Root
          scaleNotes[2], // Third
          scaleNotes[4], // Fifth
          scaleNotes[6 % scaleNotes.length], // Seventh or wrap around
        ];
        
        // Different arpeggio patterns
        const arpeggioPatterns = [
          [0, 1, 2, 3], // Up
          [3, 2, 1, 0], // Down
          [0, 1, 2, 3, 2, 1], // Up and down
          [0, 2, 1, 3], // Broken
        ];
        
        const selectedPattern = arpeggioPatterns[Math.floor(Math.random() * arpeggioPatterns.length)];
        
        for (let i = 0; i < steps; i++) {
          if (Math.random() < density) {
            const patternIndex = i % selectedPattern.length;
            const noteIndex = selectedPattern[patternIndex];
            pattern.push({
              pitch: arpeggioNotes[noteIndex],
              time: i,
              duration: '8n',
              velocity: 0.7 + (Math.random() * 0.3),
              enabled: true,
            });
          }
        }
      } else if (generationMethod === 'melody') {
        // Generate a more melodic pattern with direction and contour
        let currentDirection = Math.random() > 0.5 ? 1 : -1; // Start going up or down
        let currentIndex = Math.floor(Math.random() * scaleNotes.length);
        
        for (let i = 0; i < steps; i++) {
          // Change direction occasionally
          if (Math.random() < 0.3) {
            currentDirection *= -1;
          }
          
          // Determine if a note should be placed at this step based on density
          if (Math.random() < density) {
            // Move in the current direction, but stay within the scale
            currentIndex = Math.max(0, Math.min(scaleNotes.length - 1, currentIndex + currentDirection));
            
            pattern.push({
              pitch: scaleNotes[currentIndex],
              time: i,
              duration: '8n',
              velocity: 0.7 + (Math.random() * 0.3),
              enabled: true,
            });
          }
        }
      }
      
      // If harmony is enabled, add harmony notes
      if (harmonyEnabled) {
        const harmonyPattern = [...pattern];
        
        // Add harmony notes (thirds or fifths above the melody)
        pattern.forEach(note => {
          const noteIndex = scaleNotes.indexOf(note.pitch);
          if (noteIndex !== -1) {
            // Add a third above (2 scale degrees up)
            const thirdIndex = (noteIndex + 2) % scaleNotes.length;
            // Add the harmony note if it doesn't conflict with an existing note
            if (!pattern.some(n => n.time === note.time && n.pitch === scaleNotes[thirdIndex])) {
              harmonyPattern.push({
                pitch: scaleNotes[thirdIndex],
                time: note.time,
                duration: note.duration,
                velocity: note.velocity * 0.8, // Slightly quieter
                enabled: true,
              });
            }
          }
        });
        
        // Create a new pattern with the melody and harmony
        createPattern(track.id, harmonyPattern);
      } else {
        // Create a new pattern with just the melody
        createPattern(track.id, pattern);
      }
      
      setIsGenerating(false);
      onClose();
    }, 1000); // Simulate AI thinking time
  };
  
  // Complete an existing melody
  const completeMelody = () => {
    if (!track || !selectedPatternId || !Array.isArray(track.patterns)) return;
    
    // Find the selected pattern
    const selectedPattern = track.patterns.find(p => p.id === selectedPatternId);
    if (!selectedPattern) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      // Get the existing notes
      const existingNotes = selectedPattern.notes || [];
      
      // Get the scale notes based on the root note and octave
      const scaleNotes = getScaleNotes(rootNote, octave, scale);
      
      // Analyze the existing pattern to find the most common notes
      const noteFrequency = {};
      existingNotes.forEach(note => {
        if (!noteFrequency[note.pitch]) {
          noteFrequency[note.pitch] = 0;
        }
        noteFrequency[note.pitch]++;
      });
      
      // Find the most common notes
      const sortedNotes = Object.keys(noteFrequency).sort((a, b) => noteFrequency[b] - noteFrequency[a]);
      
      // Find empty slots in the pattern (times where no notes exist)
      const filledTimes = existingNotes.map(note => note.time);
      const emptyTimes = [];
      for (let i = 0; i < 16; i++) {
        if (!filledTimes.includes(i)) {
          emptyTimes.push(i);
        }
      }
      
      // Fill some of the empty slots based on the density parameter
      const newNotes = [...existingNotes];
      
      emptyTimes.forEach(time => {
        if (Math.random() < density * 0.7) { // Slightly lower density for completions
          // Decide whether to use a common note or a new note from the scale
          const useCommonNote = Math.random() < 0.7;
          let pitch;
          
          if (useCommonNote && sortedNotes.length > 0) {
            // Use one of the common notes
            const noteIndex = Math.floor(Math.random() * Math.min(3, sortedNotes.length));
            pitch = sortedNotes[noteIndex];
          } else {
            // Use a random note from the scale
            const noteIndex = Math.floor(Math.random() * scaleNotes.length);
            pitch = scaleNotes[noteIndex];
          }
          
          newNotes.push({
            pitch,
            time,
            duration: '8n',
            velocity: 0.7 + (Math.random() * 0.3),
            enabled: true,
          });
        }
      });
      
      // Update the pattern with the new notes
      updatePattern(track.id, selectedPatternId, newNotes);
      
      setIsGenerating(false);
      onClose();
    }, 1000); // Simulate AI thinking time
  };
  
  // Helper function to generate scale notes
  const getScaleNotes = (root, oct, scaleType) => {
    const scalePattern = SCALES[scaleType];
    if (!scalePattern) return [];
    
    // Map the scale pattern to actual note names with octaves
    return scalePattern.map(note => {
      // Replace the 'C' in the scale pattern with the selected root note
      const actualNote = note.replace('C', root);
      return `${actualNote}${oct}`;
    });
  };
  
  // Helper function to generate a base pattern
  const generateBasePattern = (length, dens, notes) => {
    const pattern = new Array(length).fill(null);
    
    // Always place a note at the first position
    pattern[0] = notes[0];
    
    // Place notes at other positions based on density
    for (let i = 1; i < length; i++) {
      if (Math.random() < dens) {
        const noteIndex = Math.floor(Math.random() * notes.length);
        pattern[i] = notes[noteIndex];
      }
    }
    
    return pattern;
  };
  
  // Render the component
  return (
    <>
      <Button
        leftIcon={<FaRobot />}
        colorScheme="purple"
        onClick={onOpen}
        isDisabled={!currentTrack}
        w="100%"
        mb={4}
      >
        AI Composer
      </Button>
      
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={useColorModeValue('white', 'gray.800')}>
          <ModalHeader>AI Composer</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <Tabs isFitted variant="enclosed" index={activeTab} onChange={setActiveTab}>
              <TabList mb="1em">
                <Tab><HStack><FaRandom /><Text>Generate</Text></HStack></Tab>
                <Tab><HStack><FaMagic /><Text>Complete</Text></HStack></Tab>
              </TabList>
              
              <TabPanels>
                {/* Generate Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Genre</FormLabel>
                      <Select value={genre} onChange={(e) => applyGenrePreset(e.target.value)}>
                        {Object.keys(GENRES).map((g) => (
                          <option key={g} value={g}>
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <HStack>
                      <FormControl>
                        <FormLabel>Root Note</FormLabel>
                        <Select value={rootNote} onChange={(e) => setRootNote(e.target.value)}>
                          {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((note) => (
                            <option key={note} value={note}>{note}</option>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Octave</FormLabel>
                        <Select value={octave} onChange={(e) => setOctave(parseInt(e.target.value))}>
                          {[3, 4, 5, 6].map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Scale</FormLabel>
                        <Select value={scale} onChange={(e) => setScale(e.target.value)}>
                          {Object.keys(SCALES).map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </HStack>
                    
                    <FormControl>
                      <FormLabel>Generation Method</FormLabel>
                      <RadioGroup value={generationMethod} onChange={setGenerationMethod}>
                        <Stack direction="row" spacing={4} wrap="wrap">
                          <Radio value="pattern">Pattern</Radio>
                          <Radio value="random">Random</Radio>
                          <Radio value="arpeggio">Arpeggio</Radio>
                          <Radio value="melody">Melodic</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Complexity: {Math.round(complexity * 10)}</FormLabel>
                      <Slider value={complexity} min={0.1} max={1} step={0.1} onChange={setComplexity}>
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Density: {Math.round(density * 10)}</FormLabel>
                      <Slider value={density} min={0.1} max={1} step={0.1} onChange={setDensity}>
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="harmony-switch" mb="0">
                        Add Harmony
                      </FormLabel>
                      <Switch id="harmony-switch" isChecked={harmonyEnabled} onChange={(e) => setHarmonyEnabled(e.target.checked)} />
                    </FormControl>
                  </VStack>
                </TabPanel>
                
                {/* Complete Tab */}
                <TabPanel p={2}>
                  <VStack spacing={3} align="stretch">
                    {track && track.patterns && track.patterns.length > 0 ? (
                      <>
                        <FormControl>
                          <FormLabel>Select Pattern</FormLabel>
                          <Select 
                            value={selectedPatternId || ''}
                            onChange={(e) => setSelectedPatternId(e.target.value)}
                          >
                            {track.patterns.map(pattern => (
                              <option key={pattern.id} value={pattern.id}>
                                {pattern.name || `Pattern ${track.patterns.indexOf(pattern) + 1}`}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Density: {Math.round(density * 10)}</FormLabel>
                          <Slider 
                            value={density} 
                            min={0.1} 
                            max={1} 
                            step={0.1} 
                            onChange={setDensity}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </FormControl>
                        
                        <Button
                          leftIcon={<FaMagic />}
                          colorScheme="purple"
                          onClick={completeMelody}
                          isLoading={isGenerating}
                          loadingText="Completing..."
                        >
                          Complete Melody
                        </Button>
                      </>
                    ) : (
                      <Text color="orange.500">
                        No patterns available. Create a pattern first or use the Generate tab.
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
            
            {isGenerating && (
              <Box mt={4}>
                <Text mb={2}>AI is composing...</Text>
                <Progress size="sm" isIndeterminate colorScheme="purple" />
              </Box>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="purple" 
              leftIcon={activeTab === 0 ? <FaMusic /> : <FaMagic />}
              onClick={activeTab === 0 ? generateMelody : completeMelody}
              isLoading={isGenerating}
              isDisabled={!currentTrack || (activeTab === 1 && (!selectedPatternId || !track || !Array.isArray(track.patterns) || track.patterns.length === 0))}
            >
              {activeTab === 0 ? 'Generate' : 'Complete'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AIComposer; 