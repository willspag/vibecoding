import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Button,
  HStack,
  VStack,
  Select,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useAudio } from '../../context/AudioContext';

// Define note names for the piano roll
const NOTES = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3'];

// Define the number of steps in the sequencer
const STEPS = 16;

const SequencerGrid = () => {
  const {
    currentTrack,
    tracks,
    createPattern,
    updatePattern,
  } = useAudio();
  
  const [activeNotes, setActiveNotes] = useState(
    Array(NOTES.length).fill().map(() => Array(STEPS).fill(false))
  );
  
  const [currentStep, setCurrentStep] = useState(-1);
  const [selectedDuration, setSelectedDuration] = useState('8n');
  
  // Get the current track
  const track = tracks.find(t => t.id === currentTrack);
  
  // Initialize pattern for the track if it doesn't exist
  useEffect(() => {
    // Make sure track exists before trying to access its properties
    if (track) {
      // Check if track.patterns exists and initialize if needed
      if (!track.patterns || track.patterns.length === 0) {
        createPattern(track.id, []);
      }
    }
  }, [track, createPattern]);
  
  // Handle clicking on a grid cell
  const handleCellClick = (rowIndex, colIndex) => {
    const newActiveNotes = [...activeNotes];
    newActiveNotes[rowIndex][colIndex] = !newActiveNotes[rowIndex][colIndex];
    
    setActiveNotes(newActiveNotes);
    
    // Update the pattern in the audio context
    if (track && track.patterns && track.patterns.length > 0) {
      const pattern = track.patterns[0];
      
      // Convert the grid to notes format
      const notes = [];
      newActiveNotes.forEach((row, rowIndex) => {
        row.forEach((isActive, colIndex) => {
          if (isActive) {
            notes.push({
              pitch: NOTES[rowIndex],
              time: colIndex,
              duration: selectedDuration,
              velocity: 0.7,
              enabled: true,
            });
          }
        });
      });
      
      updatePattern(track.id, pattern.id, notes);
    }
  };
  
  // Clear the grid
  const clearGrid = () => {
    setActiveNotes(Array(NOTES.length).fill().map(() => Array(STEPS).fill(false)));
    
    // Update the pattern in the audio context
    if (track && track.patterns && track.patterns.length > 0) {
      const pattern = track.patterns[0];
      updatePattern(track.id, pattern.id, []);
    }
  };
  
  // Render the grid
  return (
    <Box className="sequencer-grid">
      {/* Grid implementation */}
      <Grid templateColumns={`auto repeat(${STEPS}, 1fr)`} gap={1}>
        {/* Note labels */}
        {NOTES.map((note, rowIndex) => (
          <React.Fragment key={note}>
            <GridItem>
              <Text fontSize="xs">{note}</Text>
            </GridItem>
            {/* Grid cells */}
            {Array(STEPS).fill().map((_, colIndex) => (
              <GridItem
                key={colIndex}
                w="100%"
                h="24px"
                bg={activeNotes[rowIndex][colIndex] 
                  ? "blue.500" 
                  : useColorModeValue("gray.100", "gray.700")}
                borderRadius="sm"
                cursor="pointer"
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </React.Fragment>
        ))}
      </Grid>
      
      <HStack mt={4} spacing={4}>
        <Button size="sm" onClick={clearGrid}>Clear Grid</Button>
        <Select 
          size="sm" 
          value={selectedDuration} 
          onChange={(e) => setSelectedDuration(e.target.value)}
          width="120px"
        >
          <option value="16n">1/16 Note</option>
          <option value="8n">1/8 Note</option>
          <option value="4n">1/4 Note</option>
          <option value="2n">1/2 Note</option>
        </Select>
      </HStack>
    </Box>
  );
};

export default SequencerGrid; 