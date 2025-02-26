import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  IconButton,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { FaPlus, FaFolder } from 'react-icons/fa';
import { useAudio } from '../context/AudioContext';
import AudioInitializer from '../components/ui/AudioInitializer';
import TestSoundButton from '../components/ui/TestSoundButton';

// Components
import InstrumentPanel from '../components/studio/InstrumentPanel';
import SequencerGrid from '../components/studio/SequencerGrid';
import EffectsPanel from '../components/studio/EffectsPanel';
import Visualizer from '../components/studio/Visualizer';
import ControlPanel from '../components/studio/ControlPanel';
import TrackList from '../components/studio/TrackList';
import SaveCompositionModal from '../components/studio/SaveCompositionModal';
import TutorialSystem from '../components/tutorial/TutorialSystem';

const Studio = () => {
  // Define all color values at the top level
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const panelBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const {
    isAudioInitialized,
    isPlaying,
    togglePlay,
    stop,
    bpm,
    setBpm,
    volume,
    setVolume,
    createInstrument,
    createTrack,
    tracks,
    currentTrack,
    setCurrentTrack,
    saveCurrentComposition,
    loadCompositionById,
  } = useAudio();

  const { isOpen, onClose } = useDisclosure();
  const { 
    isOpen: isSaveModalOpen, 
    onOpen: onSaveModalOpen, 
    onClose: onSaveModalClose 
  } = useDisclosure();
  const { 
    isOpen: isLoadModalOpen, 
    onOpen: onLoadModalOpen, 
    onClose: onLoadModalClose 
  } = useDisclosure();
  
  const [showTutorial, setShowTutorial] = useState(true);

  // Initialize a default track if none exists
  useEffect(() => {
    if (isAudioInitialized && tracks.length === 0) {
      const defaultInstrument = createInstrument('synth');
      createTrack('Track 1', defaultInstrument.id);
    }
  }, [isAudioInitialized, tracks.length, createInstrument, createTrack]);

  // Handle tutorial dismissal
  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('soundscape_tutorial_dismissed', 'true');
  };

  // Check if tutorial was previously dismissed
  useEffect(() => {
    const tutorialDismissed = localStorage.getItem('soundscape_tutorial_dismissed');
    if (tutorialDismissed) {
      setShowTutorial(false);
    }
  }, []);

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)" p={4}>
      {/* Audio Initializer */}
      <AudioInitializer />
      
      {/* Main Studio Layout */}
      <Grid
        templateColumns={{ base: "1fr", lg: "250px 1fr" }}
        templateRows={{ base: "auto 1fr auto", lg: "1fr auto" }}
        gap={4}
        h="full"
      >
        {/* Sidebar */}
        <GridItem
          colSpan={1}
          rowSpan={1}
          bg={panelBgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          display={{ base: "none", lg: "block" }}
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md">Tracks</Heading>
            <TrackList />
            <Button 
              leftIcon={<FaPlus />} 
              colorScheme="blue" 
              size="sm"
              onClick={() => {
                const newInstrument = createInstrument('synth');
                createTrack(`Track ${tracks.length + 1}`, newInstrument.id);
              }}
            >
              Add Track
            </Button>
          </VStack>
        </GridItem>

        {/* Main Content Area */}
        <GridItem
          colSpan={1}
          rowSpan={1}
          bg={panelBgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={4} align="stretch" h="full">
            <Flex justify="space-between" align="center">
              <Heading size="md">Studio</Heading>
              <HStack>
                <TestSoundButton />
                <Button
                  leftIcon={<FaFolder />}
                  colorScheme="teal"
                  variant="outline"
                  size="sm"
                  onClick={onLoadModalOpen}
                >
                  Load
                </Button>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={onSaveModalOpen}
                >
                  Save
                </Button>
              </HStack>
            </Flex>
            
            <Tabs variant="enclosed" flex="1" display="flex" flexDirection="column">
              <TabList>
                <Tab>Sequencer</Tab>
                <Tab>Instruments</Tab>
                <Tab>Effects</Tab>
                <Tab>Visualizer</Tab>
              </TabList>
              
              <TabPanels flex="1">
                <TabPanel h="full">
                  <SequencerGrid />
                </TabPanel>
                <TabPanel h="full">
                  <InstrumentPanel />
                </TabPanel>
                <TabPanel h="full">
                  <EffectsPanel />
                </TabPanel>
                <TabPanel h="full">
                  <Visualizer />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </GridItem>

        {/* Control Panel */}
        <GridItem
          colSpan={{ base: 1, lg: 2 }}
          bg={panelBgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <ControlPanel />
        </GridItem>
      </Grid>
      
      {/* Save Modal */}
      <SaveCompositionModal 
        isOpen={isSaveModalOpen} 
        onClose={onSaveModalClose} 
      />
      
      {/* Tutorial System */}
      {showTutorial && (
        <TutorialSystem onDismiss={dismissTutorial} />
      )}
    </Box>
  );
};

export default Studio; 