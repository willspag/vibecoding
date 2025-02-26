import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { FaMusic, FaVolumeUp } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';

const AudioInitializer = () => {
  const { isAudioInitialized, initializeAudio } = useAudio();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: !isAudioInitialized });
  const [isInitializing, setIsInitializing] = useState(false);

  // Handle the initialization
  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeAudio();
      onClose();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  // If audio is already initialized, don't show anything
  if (isAudioInitialized) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enable Audio</ModalHeader>
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text>
              SoundScape needs permission to play audio. Click the button below to enable audio.
            </Text>
            <Button
              leftIcon={<FaVolumeUp />}
              colorScheme="blue"
              onClick={handleInitialize}
              isLoading={isInitializing}
              loadingText="Initializing..."
              size="lg"
              width="100%"
            >
              Enable Audio
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AudioInitializer; 