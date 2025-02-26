import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Text,
  VStack,
  HStack,
  Box,
  List,
  ListItem,
  Flex,
  IconButton,
  Heading,
  Divider,
  Input,
  FormControl,
  FormLabel,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaFolder, FaTrash, FaUpload, FaFileImport, FaPlus } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';
import { getCompositionsList, deleteComposition, importComposition } from '../../services/StorageService';

const LoadCompositionModal = ({ isOpen, onClose }) => {
  const { 
    loadCompositionById, 
    createNewComposition,
    isLoading 
  } = useAudio();
  
  const [compositions, setCompositions] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Load compositions list when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCompositionsList();
    }
  }, [isOpen]);

  // Load compositions list
  const loadCompositionsList = async () => {
    try {
      setIsLoadingList(true);
      const list = await getCompositionsList();
      
      // Sort by updated date (newest first)
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      setCompositions(list);
      setIsLoadingList(false);
    } catch (error) {
      toast({
        title: 'Error loading compositions',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setIsLoadingList(false);
    }
  };

  // Handle load composition
  const handleLoadComposition = async (id) => {
    try {
      await loadCompositionById(id);
      
      toast({
        title: 'Composition loaded',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error loading composition',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle delete composition
  const handleDeleteComposition = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteComposition(id);
        
        toast({
          title: 'Composition deleted',
          description: `"${title}" has been deleted.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Refresh the list
        loadCompositionsList();
      } catch (error) {
        toast({
          title: 'Error deleting composition',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Handle import composition
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      
      // Check if it's a JSON file
      if (!file.name.endsWith('.json')) {
        throw new Error('Please select a JSON file');
      }
      
      // Import the composition
      const id = await importComposition(file);
      
      toast({
        title: 'Composition imported',
        description: 'The composition has been imported successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh the list
      await loadCompositionsList();
      
      // Load the imported composition
      await loadCompositionById(id);
      
      setIsImporting(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error importing composition',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setIsImporting(false);
    }
    
    // Reset the file input
    event.target.value = null;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle new composition
  const handleNewComposition = () => {
    createNewComposition();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Load Composition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={2}>
              <Button
                leftIcon={<FaPlus />}
                colorScheme="blue"
                onClick={handleNewComposition}
                isDisabled={isLoading || isLoadingList || isImporting}
              >
                New Composition
              </Button>
              <Button
                leftIcon={<FaFileImport />}
                onClick={handleImportClick}
                isLoading={isImporting}
                loadingText="Importing..."
                isDisabled={isLoading || isLoadingList}
              >
                Import
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
              />
            </HStack>
            
            <Divider />
            
            <Heading size="md">Saved Compositions</Heading>
            
            {isLoadingList ? (
              <Flex justify="center" align="center" p={8}>
                <Spinner size="xl" />
              </Flex>
            ) : compositions.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No saved compositions found. Create a new one or import from a file.
              </Alert>
            ) : (
              <List spacing={2}>
                {compositions.map((composition) => (
                  <ListItem key={composition.id}>
                    <Box
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={useColorModeValue('gray.200', 'gray.700')}
                      _hover={{
                        bg: useColorModeValue('gray.50', 'gray.700'),
                      }}
                    >
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Heading size="sm">{composition.title}</Heading>
                          <Text fontSize="xs" color="gray.500">
                            Last modified: {formatDate(composition.updatedAt)}
                          </Text>
                        </Box>
                        <HStack>
                          <IconButton
                            aria-label="Load composition"
                            icon={<FaFolder />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleLoadComposition(composition.id)}
                            isDisabled={isLoading}
                          />
                          <IconButton
                            aria-label="Delete composition"
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteComposition(composition.id, composition.title)}
                          />
                        </HStack>
                      </Flex>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoadCompositionModal; 