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
  Badge,
  useColorModeValue,
  Flex,
  Divider,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';

const EffectsPanel = () => {
  const { 
    currentTrack, 
    tracks,
    addEffect,
    removeEffect,
  } = useAudio();
  
  const [selectedEffectType, setSelectedEffectType] = useState('reverb');
  const [effectParams, setEffectParams] = useState({
    reverb: {
      decay: 1.5,
      preDelay: 0.01,
    },
    delay: {
      delayTime: 0.25,
      feedback: 0.5,
    },
    distortion: {
      distortion: 0.4,
    },
    chorus: {
      frequency: 1.5,
      delayTime: 3.5,
      depth: 0.7,
    },
  });
  
  // Get the current track
  const track = tracks.find(t => t.id === currentTrack);
  
  // Handle effect type change
  const handleEffectTypeChange = (e) => {
    setSelectedEffectType(e.target.value);
  };
  
  // Handle parameter change
  const handleParamChange = (effectType, param, value) => {
    setEffectParams(prev => ({
      ...prev,
      [effectType]: {
        ...prev[effectType],
        [param]: value,
      },
    }));
  };
  
  // Add an effect to the current track
  const handleAddEffect = () => {
    if (track) {
      addEffect(track.id, selectedEffectType, effectParams[selectedEffectType]);
    }
  };
  
  // Remove an effect from the current track
  const handleRemoveEffect = (effectId) => {
    if (track) {
      removeEffect(track.id, effectId);
    }
  };
  
  // Get the display name for an effect type
  const getEffectDisplayName = (type) => {
    switch (type) {
      case 'reverb':
        return 'Reverb';
      case 'delay':
        return 'Delay';
      case 'distortion':
        return 'Distortion';
      case 'chorus':
        return 'Chorus';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Track Effects
          </Text>
          {track ? (
            <>
              {track.effects && track.effects.length > 0 ? (
                <VStack spacing={2} align="stretch">
                  {track.effects.map((effect) => (
                    <Box
                      key={effect.id}
                      p={3}
                      borderRadius="md"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      borderWidth="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                    >
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Badge colorScheme="purple">
                            {getEffectDisplayName(effect.type)}
                          </Badge>
                        </HStack>
                        <Tooltip label="Remove Effect">
                          <IconButton
                            aria-label="Remove Effect"
                            icon={<FaTrash />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleRemoveEffect(effect.id)}
                          />
                        </Tooltip>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Box
                  p={4}
                  borderRadius="md"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  textAlign="center"
                >
                  <Text>No effects added to this track yet.</Text>
                </Box>
              )}
            </>
          ) : (
            <Box
              p={4}
              borderRadius="md"
              bg={useColorModeValue('gray.50', 'gray.700')}
              textAlign="center"
            >
              <Text>No track selected.</Text>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Add Effect
          </Text>
          {track ? (
            <VStack spacing={3} align="stretch">
              <FormControl>
                <FormLabel>Effect Type</FormLabel>
                <Select
                  value={selectedEffectType}
                  onChange={handleEffectTypeChange}
                >
                  <option value="reverb">Reverb</option>
                  <option value="delay">Delay</option>
                  <option value="distortion">Distortion</option>
                  <option value="chorus">Chorus</option>
                </Select>
              </FormControl>
              
              {/* Effect Parameters */}
              <Box
                p={4}
                borderRadius="md"
                bg={useColorModeValue('gray.50', 'gray.700')}
              >
                {selectedEffectType === 'reverb' && (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Decay: {effectParams.reverb.decay.toFixed(2)}s
                      </FormLabel>
                      <Slider
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={effectParams.reverb.decay}
                        onChange={(val) => handleParamChange('reverb', 'decay', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Pre-Delay: {effectParams.reverb.preDelay.toFixed(3)}s
                      </FormLabel>
                      <Slider
                        min={0.001}
                        max={0.1}
                        step={0.001}
                        value={effectParams.reverb.preDelay}
                        onChange={(val) => handleParamChange('reverb', 'preDelay', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                  </VStack>
                )}
                
                {selectedEffectType === 'delay' && (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Delay Time: {effectParams.delay.delayTime.toFixed(2)}s
                      </FormLabel>
                      <Slider
                        min={0.01}
                        max={1}
                        step={0.01}
                        value={effectParams.delay.delayTime}
                        onChange={(val) => handleParamChange('delay', 'delayTime', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Feedback: {effectParams.delay.feedback.toFixed(2)}
                      </FormLabel>
                      <Slider
                        min={0}
                        max={0.9}
                        step={0.01}
                        value={effectParams.delay.feedback}
                        onChange={(val) => handleParamChange('delay', 'feedback', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                  </VStack>
                )}
                
                {selectedEffectType === 'distortion' && (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Distortion: {effectParams.distortion.distortion.toFixed(2)}
                      </FormLabel>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={effectParams.distortion.distortion}
                        onChange={(val) => handleParamChange('distortion', 'distortion', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                  </VStack>
                )}
                
                {selectedEffectType === 'chorus' && (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Frequency: {effectParams.chorus.frequency.toFixed(2)} Hz
                      </FormLabel>
                      <Slider
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={effectParams.chorus.frequency}
                        onChange={(val) => handleParamChange('chorus', 'frequency', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Delay Time: {effectParams.chorus.delayTime.toFixed(2)} ms
                      </FormLabel>
                      <Slider
                        min={1}
                        max={20}
                        step={0.1}
                        value={effectParams.chorus.delayTime}
                        onChange={(val) => handleParamChange('chorus', 'delayTime', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">
                        Depth: {effectParams.chorus.depth.toFixed(2)}
                      </FormLabel>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={effectParams.chorus.depth}
                        onChange={(val) => handleParamChange('chorus', 'depth', val)}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </FormControl>
                  </VStack>
                )}
              </Box>
              
              <Button
                leftIcon={<FaPlus />}
                colorScheme="blue"
                onClick={handleAddEffect}
                isDisabled={!track}
              >
                Add Effect
              </Button>
            </VStack>
          ) : (
            <Box
              p={4}
              borderRadius="md"
              bg={useColorModeValue('gray.50', 'gray.700')}
              textAlign="center"
            >
              <Text>Select a track to add effects.</Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default EffectsPanel; 