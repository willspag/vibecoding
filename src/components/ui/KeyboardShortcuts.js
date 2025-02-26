import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Text,
  Box,
  Flex,
  Badge,
  useColorModeValue,
  IconButton,
  Tooltip,
  Kbd,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { FaKeyboard, FaQuestion } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';

const KeyboardShortcuts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    togglePlay,
    stop,
    bpm,
    setBpm,
    volume,
    setVolume,
    currentTrack,
    tracks,
    createTrack,
    removeTrack,
    saveCurrentComposition,
    loadCompositionById,
    createNewComposition,
  } = useAudio();

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (e.target.matches('input, textarea, select')) {
        return;
      }

      // Don't trigger shortcuts if a modal is open
      if (document.querySelector('.chakra-modal__content')) {
        return;
      }

      // Playback controls
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        togglePlay();
      } else if (e.code === 'Escape') {
        stop();
      } else if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveCurrentComposition();
      } else if (e.code === 'KeyO' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Open load composition modal
        document.querySelector('button[aria-label="Load Composition"]')?.click();
      } else if (e.code === 'KeyN' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        createNewComposition();
      }

      // BPM controls
      else if (e.code === 'ArrowUp' && e.altKey) {
        e.preventDefault();
        setBpm(Math.min(bpm + 5, 200));
      } else if (e.code === 'ArrowDown' && e.altKey) {
        e.preventDefault();
        setBpm(Math.max(bpm - 5, 40));
      }

      // Volume controls
      else if (e.code === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        setVolume(Math.min(volume + 5, 0));
      } else if (e.code === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        setVolume(Math.max(volume - 5, -60));
      }

      // Track controls
      else if (e.code === 'KeyT' && e.ctrlKey) {
        e.preventDefault();
        // Create a new track
        document.querySelector('button[aria-label="Add Track"]')?.click();
      } else if (e.code === 'Delete' && e.ctrlKey && currentTrack) {
        e.preventDefault();
        removeTrack(currentTrack);
      }

      // Track navigation
      else if (e.code === 'Digit1' && e.altKey && tracks.length >= 1) {
        e.preventDefault();
        // Select track 1
        document.querySelector(`button[data-track-id="${tracks[0].id}"]`)?.click();
      } else if (e.code === 'Digit2' && e.altKey && tracks.length >= 2) {
        e.preventDefault();
        // Select track 2
        document.querySelector(`button[data-track-id="${tracks[1].id}"]`)?.click();
      } else if (e.code === 'Digit3' && e.altKey && tracks.length >= 3) {
        e.preventDefault();
        // Select track 3
        document.querySelector(`button[data-track-id="${tracks[2].id}"]`)?.click();
      } else if (e.code === 'Digit4' && e.altKey && tracks.length >= 4) {
        e.preventDefault();
        // Select track 4
        document.querySelector(`button[data-track-id="${tracks[3].id}"]`)?.click();
      }

      // Show keyboard shortcuts
      else if (e.code === 'Slash' && e.ctrlKey) {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlay,
    stop,
    bpm,
    setBpm,
    volume,
    setVolume,
    currentTrack,
    tracks,
    createTrack,
    removeTrack,
    saveCurrentComposition,
    onOpen,
  ]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <>
      <Tooltip label="Keyboard Shortcuts">
        <IconButton
          icon={<FaKeyboard />}
          aria-label="Keyboard Shortcuts"
          onClick={onOpen}
          variant="ghost"
          colorScheme="blue"
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>Keyboard Shortcuts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Playback Controls
                </Text>
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td><Kbd>Space</Kbd></Td>
                      <Td>Play/Pause</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Esc</Kbd></Td>
                      <Td>Stop</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>
                  File Operations
                </Text>
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td><Kbd>Ctrl</Kbd> + <Kbd>S</Kbd></Td>
                      <Td>Save Composition</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Ctrl</Kbd> + <Kbd>O</Kbd></Td>
                      <Td>Open Composition</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Ctrl</Kbd> + <Kbd>N</Kbd></Td>
                      <Td>New Composition</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Track Controls
                </Text>
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td><Kbd>Ctrl</Kbd> + <Kbd>T</Kbd></Td>
                      <Td>Add New Track</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Ctrl</Kbd> + <Kbd>Delete</Kbd></Td>
                      <Td>Delete Current Track</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Alt</Kbd> + <Kbd>1</Kbd> to <Kbd>4</Kbd></Td>
                      <Td>Select Track 1-4</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Tempo & Volume
                </Text>
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td><Kbd>Alt</Kbd> + <Kbd>↑</Kbd></Td>
                      <Td>Increase BPM</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Alt</Kbd> + <Kbd>↓</Kbd></Td>
                      <Td>Decrease BPM</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Alt</Kbd> + <Kbd>→</Kbd></Td>
                      <Td>Increase Volume</Td>
                    </Tr>
                    <Tr>
                      <Td><Kbd>Alt</Kbd> + <Kbd>←</Kbd></Td>
                      <Td>Decrease Volume</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Help
                </Text>
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td><Kbd>Ctrl</Kbd> + <Kbd>/</Kbd></Td>
                      <Td>Show Keyboard Shortcuts</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default KeyboardShortcuts; 