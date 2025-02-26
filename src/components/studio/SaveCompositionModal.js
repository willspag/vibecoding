import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Text,
  VStack,
  HStack,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { FaSave, FaDownload } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';
import { exportComposition } from '../../services/StorageService';

const SaveCompositionModal = ({ isOpen, onClose }) => {
  const { 
    currentComposition, 
    saveCurrentComposition, 
    isSaving 
  } = useAudio();
  
  const [title, setTitle] = useState(currentComposition.title || 'Untitled Composition');
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  // Update title when currentComposition changes
  useEffect(() => {
    setTitle(currentComposition.title || 'Untitled Composition');
  }, [currentComposition]);

  // Handle save
  const handleSave = async () => {
    try {
      await saveCurrentComposition(title);
      
      toast({
        title: 'Composition saved',
        description: `"${title}" has been saved to your browser's local storage.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error saving composition',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Save first to ensure we have an ID
      const id = await saveCurrentComposition(title);
      
      // Export to a file
      const blob = await exportComposition(id);
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast({
        title: 'Composition exported',
        description: `"${title}" has been exported as a JSON file.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsExporting(false);
    } catch (error) {
      toast({
        title: 'Error exporting composition',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save Composition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your composition"
              />
            </FormControl>
            
            <Box>
              <Text fontSize="sm" color="gray.500">
                Your composition will be saved to your browser's local storage.
                You can export it as a file to back it up or share it with others.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            <Button variant="ghost" onClick={onClose} isDisabled={isSaving || isExporting}>
              Cancel
            </Button>
            <Button
              leftIcon={<FaDownload />}
              onClick={handleExport}
              isLoading={isExporting}
              loadingText="Exporting..."
              isDisabled={isSaving}
            >
              Export
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<FaSave />}
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
              isDisabled={isExporting}
            >
              Save
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveCompositionModal; 