import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import PlayButton from './PlayButton';

const ControlPanel = ({
  isPlaying,
  onTogglePlay,
  onStop,
  bpm,
  onBpmChange,
  volume,
  onVolumeChange,
}) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  // Convert volume from dB to percentage for display
  const volumePercentage = Math.round(((volume + 60) / 60) * 100);

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify="space-between"
      wrap="wrap"
      gap={4}
    >
      {/* Transport Controls */}
      <HStack spacing={2}>
        <PlayButton />
        <Tooltip label="Stop">
          <IconButton
            aria-label="Stop"
            icon={<FaStop />}
            colorScheme="red"
            size="lg"
            isRound
            onClick={onStop}
          />
        </Tooltip>
      </HStack>

      {/* BPM Control */}
      <HStack spacing={2} minW="200px">
        <Text fontSize="sm" fontWeight="bold" width="40px">BPM:</Text>
        <Slider
          value={bpm}
          min={40}
          max={200}
          step={1}
          onChange={onBpmChange}
          aria-label="BPM"
          colorScheme="blue"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Text fontSize="xs" fontWeight="bold">{bpm}</Text>
          </SliderThumb>
        </Slider>
      </HStack>

      {/* Volume Control */}
      <HStack spacing={2} minW="200px">
        <IconButton
          aria-label="Volume"
          icon={volume <= -50 ? <FaVolumeMute /> : <FaVolumeUp />}
          variant="ghost"
          size="sm"
        />
        <Slider
          value={volume}
          min={-60}
          max={0}
          step={1}
          onChange={onVolumeChange}
          aria-label="Volume"
          colorScheme="green"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box>
              <Text fontSize="xs" fontWeight="bold">{volumePercentage}%</Text>
            </Box>
          </SliderThumb>
        </Slider>
      </HStack>
    </Flex>
  );
};

export default ControlPanel; 