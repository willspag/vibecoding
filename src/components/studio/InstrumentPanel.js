import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { FaPlus, FaMusic } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';

const InstrumentPanel = () => {
  const { 
    instruments, 
    createInstrument, 
    currentTrack, 
    tracks,
    createTrack,
  } = useAudio();
  
  const [selectedInstrumentType, setSelectedInstrumentType] = useState('synth');
  const [instrumentParams, setInstrumentParams] = useState({
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.8,
    },
  });
  
  // Get the current track
  const track = tracks.find(t => t.id === currentTrack);
  
  // Get the instrument for the current track
  const trackInstrument = track 
    ? instruments.find(i => i.id === track.instrumentId) 
    : null;
  
  // Handle instrument type change
  const handleInstrumentTypeChange = (e) => {
    setSelectedInstrumentType(e.target.value);
  };
  
  // Handle parameter change
  const handleParamChange = (section, param, value) => {
    setInstrumentParams(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [param]: value,
      },
    }));
  };
  
  // Create a new instrument and track
  const handleCreateInstrument = () => {
    const newInstrument = createInstrument(selectedInstrumentType, instrumentParams);
    createTrack(`Track ${tracks.length + 1}`, newInstrument.id);
  };
  
  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Current Instrument
          </Text>
          {trackInstrument ? (
            <Box
              p={4}
              borderRadius="md"
              bg={useColorModeValue('gray.50', 'gray.700')}
            >
              <Text fontWeight="bold">{trackInstrument.type.charAt(0).toUpperCase() + trackInstrument.type.slice(1)}</Text>
              <Text fontSize="sm" color="gray.500">
                Track: {track ? track.name : 'Unknown'}
              </Text>
              
              <Divider my={3} />
              
              <Accordion allowToggle defaultIndex={[0]}>
                <AccordionItem border="none">
                  <h2>
                    <AccordionButton px={0}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        Oscillator Settings
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} px={0}>
                    <FormControl mb={3}>
                      <FormLabel fontSize="sm">Oscillator Type</FormLabel>
                      <Select
                        size="sm"
                        value={instrumentParams.oscillator.type}
                        onChange={(e) => handleParamChange('oscillator', 'type', e.target.value)}
                      >
                        <option value="sine">Sine</option>
                        <option value="square">Square</option>
                        <option value="triangle">Triangle</option>
                        <option value="sawtooth">Sawtooth</option>
                      </Select>
                    </FormControl>
                  </AccordionPanel>
                </AccordionItem>
                
                <AccordionItem border="none">
                  <h2>
                    <AccordionButton px={0}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        Envelope Settings
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} px={0}>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel fontSize="sm">Attack: {instrumentParams.envelope.attack.toFixed(2)}s</FormLabel>
                        <Slider
                          min={0}
                          max={2}
                          step={0.01}
                          value={instrumentParams.envelope.attack}
                          onChange={(val) => handleParamChange('envelope', 'attack', val)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Decay: {instrumentParams.envelope.decay.toFixed(2)}s</FormLabel>
                        <Slider
                          min={0}
                          max={2}
                          step={0.01}
                          value={instrumentParams.envelope.decay}
                          onChange={(val) => handleParamChange('envelope', 'decay', val)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Sustain: {instrumentParams.envelope.sustain.toFixed(2)}</FormLabel>
                        <Slider
                          min={0}
                          max={1}
                          step={0.01}
                          value={instrumentParams.envelope.sustain}
                          onChange={(val) => handleParamChange('envelope', 'sustain', val)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">Release: {instrumentParams.envelope.release.toFixed(2)}s</FormLabel>
                        <Slider
                          min={0}
                          max={5}
                          step={0.01}
                          value={instrumentParams.envelope.release}
                          onChange={(val) => handleParamChange('envelope', 'release', val)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          ) : (
            <Box
              p={4}
              borderRadius="md"
              bg={useColorModeValue('gray.50', 'gray.700')}
              textAlign="center"
            >
              <Text>No track selected or no instrument assigned.</Text>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Add New Instrument
          </Text>
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel>Instrument Type</FormLabel>
              <Select
                value={selectedInstrumentType}
                onChange={handleInstrumentTypeChange}
              >
                <option value="synth">Basic Synth</option>
                <option value="amSynth">AM Synth</option>
                <option value="fmSynth">FM Synth</option>
                <option value="membraneSynth">Membrane Synth</option>
                <option value="pluck">Pluck Synth</option>
              </Select>
            </FormControl>
            
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              onClick={handleCreateInstrument}
            >
              Add Instrument & Track
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default InstrumentPanel; 