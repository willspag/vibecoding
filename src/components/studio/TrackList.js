import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  useColorModeValue,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaVolumeMute } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';
import TestSoundButton from '../ui/TestSoundButton';

const TrackList = ({ tracks = [], currentTrack, onSelectTrack }) => {
  const { removeTrack } = useAudio();
  
  const emptyBoxBg = useColorModeValue('gray.50', 'gray.700');
  const selectedTrackBg = useColorModeValue('blue.50', 'blue.900');
  const unselectedTrackBg = useColorModeValue('white', 'gray.800');
  const selectedBorderColor = useColorModeValue('blue.200', 'blue.700');
  const unselectedBorderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedHoverBg = useColorModeValue('blue.100', 'blue.800');
  const unselectedHoverBg = useColorModeValue('gray.50', 'gray.700');
  
  const getInstrumentName = (track) => {
    if (!track) return 'Unknown';
    return 'Synth';
  };

  return (
    <VStack spacing={2} align="stretch" maxH="400px" overflowY="auto">
      {!tracks || tracks.length === 0 ? (
        <Box
          p={4}
          borderRadius="md"
          bg={emptyBoxBg}
          textAlign="center"
        >
          <Text>No tracks yet. Add a track to get started.</Text>
        </Box>
      ) : (
        tracks.map((track) => (
          <Box
            key={track.id}
            p={3}
            borderRadius="md"
            bg={currentTrack === track.id ? selectedTrackBg : unselectedTrackBg}
            borderWidth="1px"
            borderColor={currentTrack === track.id ? selectedBorderColor : unselectedBorderColor}
            cursor="pointer"
            onClick={() => onSelectTrack(track.id)}
            _hover={{
              bg: currentTrack === track.id ? selectedHoverBg : unselectedHoverBg
            }}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Text fontWeight={currentTrack === track.id ? 'bold' : 'normal'}>
                  {track.name}
                </Text>
                <Badge colorScheme="purple" fontSize="0.7em">
                  {getInstrumentName(track)}
                </Badge>
              </HStack>
              <HStack spacing={1}>
                <Tooltip label="Mute">
                  <IconButton
                    aria-label="Mute"
                    icon={<FaVolumeMute />}
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Mute functionality would go here
                    }}
                  />
                </Tooltip>
                <Tooltip label="Edit">
                  <IconButton
                    aria-label="Edit"
                    icon={<FaEdit />}
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit functionality would go here
                    }}
                  />
                </Tooltip>
                <Tooltip label="Delete">
                  <IconButton
                    aria-label="Delete"
                    icon={<FaTrash />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrack(track.id);
                    }}
                  />
                </Tooltip>
              </HStack>
            </Flex>
          </Box>
        ))
      )}
      <TestSoundButton />
    </VStack>
  );
};

export default TrackList; 