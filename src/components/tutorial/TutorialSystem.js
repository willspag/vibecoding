import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  VStack,
  HStack,
  Heading,
  Progress,
  useColorModeValue,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Badge,
  Kbd,
  List,
  ListItem,
  ListIcon,
  Divider,
  Collapse,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { 
  FaArrowRight, 
  FaArrowLeft, 
  FaTimes, 
  FaQuestion, 
  FaCheckCircle, 
  FaMusic, 
  FaSlidersH, 
  FaPlay, 
  FaSave, 
  FaKeyboard, 
  FaLightbulb, 
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';

// Define tutorial steps with more detailed content and images
const TUTORIAL_STEPS = [
  {
    title: 'Welcome to SoundScape!',
    content: 'SoundScape is an interactive music creation platform designed to make music production accessible and fun for everyone. This tutorial will guide you through the basic features and help you create your first composition.',
    icon: FaMusic,
    tips: [
      'You can press Ctrl+/ at any time to view keyboard shortcuts',
      'Dark/Light mode can be toggled using the sun/moon icon in the navbar',
      'Your compositions are automatically saved to your browser\'s local storage'
    ],
    image: null,
  },
  {
    title: 'The Studio Interface',
    content: 'The Studio is where you\'ll create your music. It consists of several key areas: the track list, sequencer grid, instrument panel, effects panel, and visualizer.',
    icon: FaSlidersH,
    tips: [
      'The top section shows your tracks and patterns',
      'The center grid is where you place notes',
      'The right panel lets you adjust instrument settings and effects',
      'The bottom shows visualizations of your audio'
    ],
    image: null,
    highlightSelector: '.studio-container',
  },
  {
    title: 'Creating Tracks',
    content: 'Tracks are the building blocks of your composition. Each track contains an instrument and patterns. You can have multiple tracks playing different instruments simultaneously.',
    icon: FaMusic,
    tips: [
      'Click the "Add Track" button to create a new track',
      'You can have up to 8 tracks in a composition',
      'Each track can use a different instrument',
      'Use Ctrl+T as a keyboard shortcut to add a new track'
    ],
    image: null,
    highlightSelector: 'button[aria-label="Add Track"]',
    action: 'Click the "Add Track" button to continue',
  },
  {
    title: 'Selecting Instruments',
    content: 'Each track uses an instrument to produce sound. SoundScape offers various synthesizers and instruments with different sound characteristics.',
    icon: FaSlidersH,
    tips: [
      'Click on the Instrument tab in the right panel',
      'Try different instrument types to hear how they sound',
      'Adjust parameters like attack, decay, sustain, and release to shape the sound',
      'Some instruments work better for bass, others for melody or percussion'
    ],
    image: null,
    highlightSelector: '.instrument-panel',
  },
  {
    title: 'Creating Patterns',
    content: 'Patterns are sequences of notes that your instruments will play. The sequencer grid allows you to place notes at specific times and pitches.',
    icon: FaMusic,
    tips: [
      'Click on the grid cells to add or remove notes',
      'Higher cells represent higher pitches',
      'The horizontal axis represents time',
      'You can create multiple patterns per track and arrange them in sequence'
    ],
    image: null,
    highlightSelector: '.sequencer-grid',
    action: 'Try adding some notes to the grid',
  },
  {
    title: 'Playing Your Composition',
    content: 'Use the transport controls to play, pause, and stop your composition. You can also adjust the tempo (BPM) to make your music faster or slower.',
    icon: FaPlay,
    tips: [
      'Press Space to play/pause',
      'Press Escape to stop and return to the beginning',
      'Adjust the BPM slider to change the tempo',
      'Use Alt+Up/Down arrows to change the tempo with keyboard shortcuts'
    ],
    image: null,
    highlightSelector: '.transport-controls',
  },
  {
    title: 'Adding Effects',
    content: 'Effects can transform the sound of your instruments. SoundScape includes reverb, delay, distortion, and more to enhance your tracks.',
    icon: FaSlidersH,
    tips: [
      'Click on the Effects tab in the right panel',
      'Add effects by clicking the "Add Effect" button',
      'Chain multiple effects together for complex sounds',
      'Adjust effect parameters to fine-tune the sound'
    ],
    image: null,
    highlightSelector: '.effects-panel',
  },
  {
    title: 'Using the AI Composer',
    content: 'Need inspiration? The AI Composer can generate musical patterns based on your preferences. It can create new patterns or complete existing ones.',
    icon: FaLightbulb,
    tips: [
      'Select a genre to get started with appropriate presets',
      'Adjust complexity and density to control the generated pattern',
      'Try different scales and root notes for varied musical styles',
      'Use the "Complete" tab to have AI suggest additions to your existing patterns'
    ],
    image: null,
    highlightSelector: 'button:contains("AI Composer")',
  },
  {
    title: 'Saving and Loading',
    content: 'Don\'t forget to save your compositions! SoundScape stores your work in your browser\'s local storage, so you can come back to it later.',
    icon: FaSave,
    tips: [
      'Press Ctrl+S to save your composition',
      'Give your composition a meaningful name',
      'Use Ctrl+O to open previously saved compositions',
      'You can export your compositions as JSON files to share or backup'
    ],
    image: null,
    highlightSelector: 'button[aria-label="Save Composition"]',
  },
  {
    title: 'Keyboard Shortcuts',
    content: 'SoundScape offers many keyboard shortcuts to speed up your workflow. Press Ctrl+/ at any time to view the full list of shortcuts.',
    icon: FaKeyboard,
    tips: [
      'Space: Play/Pause',
      'Escape: Stop',
      'Ctrl+S: Save',
      'Ctrl+O: Open',
      'Alt+Arrow keys: Adjust tempo and volume',
      'Alt+1-4: Select tracks 1-4'
    ],
    image: null,
    highlightSelector: 'button[aria-label="Keyboard Shortcuts"]',
  },
  {
    title: 'Visualizing Your Music',
    content: 'Switch to the Visualizer tab to see your music come to life with beautiful visualizations that react to your audio in real-time.',
    icon: FaMusic,
    tips: [
      'Different visualization modes highlight different aspects of your music',
      'Waveform shows the raw audio signal',
      'Frequency shows the distribution of frequencies',
      'Circle and Particle modes create artistic visualizations based on your audio'
    ],
    image: null,
    highlightSelector: '.visualizer-container',
  },
  {
    title: 'Congratulations!',
    content: 'You\'ve completed the tutorial! Now you\'re ready to create your own music with SoundScape. Remember, there\'s no right or wrong way to make music - experiment, have fun, and let your creativity flow!',
    icon: FaCheckCircle,
    tips: [
      'You can revisit this tutorial at any time from the help menu',
      'Check out the Explore page to see compositions from other users',
      'Share your creations with friends by exporting them',
      'Most importantly, have fun and make music you enjoy!'
    ],
    image: null,
  },
];

const TutorialSystem = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Open tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      onOpen();
    }
  }, [onOpen]);
  
  // Mark step as completed
  const markStepCompleted = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps(prev => [...prev, stepIndex]);
    }
  };
  
  // Go to next step
  const nextStep = () => {
    markStepCompleted(currentStep);
    
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial completed
      localStorage.setItem('hasSeenTutorial', 'true');
      onClose();
      toast({
        title: 'Tutorial completed!',
        description: 'You can access it again anytime from the help menu.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Jump to a specific step
  const jumpToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };
  
  // Skip tutorial
  const skipTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    onClose();
  };
  
  // Toggle tips visibility
  const toggleTips = () => {
    setShowTips(!showTips);
  };
  
  return (
    <>
      <IconButton
        icon={<FaQuestion />}
        aria-label="Open Tutorial"
        position="fixed"
        bottom="20px"
        right="20px"
        colorScheme="blue"
        borderRadius="full"
        boxShadow="lg"
        onClick={onOpen}
      />
      
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={TUTORIAL_STEPS[currentStep].icon} boxSize={5} color="blue.500" />
              <Text ml={2}>{TUTORIAL_STEPS[currentStep].title}</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Text>{TUTORIAL_STEPS[currentStep].content}</Text>
              
              {TUTORIAL_STEPS[currentStep].image && (
                <Box borderWidth="1px" borderRadius="md" overflow="hidden" borderColor={borderColor}>
                  <Image 
                    src={TUTORIAL_STEPS[currentStep].image} 
                    alt={TUTORIAL_STEPS[currentStep].title}
                    width="100%"
                  />
                </Box>
              )}
              
              {TUTORIAL_STEPS[currentStep].tips && TUTORIAL_STEPS[currentStep].tips.length > 0 && (
                <Box>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    leftIcon={<FaLightbulb />}
                    rightIcon={showTips ? <FaChevronUp /> : <FaChevronDown />}
                    onClick={toggleTips}
                    mb={2}
                  >
                    Tips & Tricks
                  </Button>
                  
                  <Collapse in={showTips} animateOpacity>
                    <Box 
                      p={4} 
                      bg={useColorModeValue('blue.50', 'blue.900')} 
                      borderRadius="md"
                    >
                      <List spacing={2}>
                        {TUTORIAL_STEPS[currentStep].tips.map((tip, index) => (
                          <ListItem key={index} display="flex">
                            <ListIcon as={FaInfoCircle} color="blue.500" mt={1} />
                            <Text>{tip}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Collapse>
                </Box>
              )}
              
              <Progress 
                value={(currentStep + 1) / TUTORIAL_STEPS.length * 100} 
                size="sm" 
                colorScheme="blue" 
                borderRadius="full" 
              />
              
              <Flex justify="center" wrap="wrap" gap={2}>
                {TUTORIAL_STEPS.map((_, index) => (
                  <Box 
                    key={index}
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={currentStep === index 
                      ? 'blue.500' 
                      : completedSteps.includes(index) 
                        ? 'green.500' 
                        : borderColor
                    }
                    cursor="pointer"
                    onClick={() => jumpToStep(index)}
                    transition="all 0.2s"
                    _hover={{
                      transform: 'scale(1.5)',
                    }}
                  />
                ))}
              </Flex>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <HStack spacing={2}>
              <Button 
                variant="ghost" 
                onClick={skipTutorial}
              >
                Skip Tutorial
              </Button>
              <Button 
                leftIcon={<FaArrowLeft />} 
                onClick={prevStep} 
                isDisabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                rightIcon={<FaArrowRight />} 
                onClick={nextStep} 
                colorScheme="blue"
              >
                {currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TutorialSystem; 