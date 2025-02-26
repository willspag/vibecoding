import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { FaVolumeUp } from 'react-icons/fa';
import * as Tone from 'tone';

const TestSoundButton = () => {
  const toast = useToast();
  
  const playTestSound = async () => {
    try {
      // Start audio context
      await Tone.start();
      
      // Create a synth and connect it to the destination
      const synth = new Tone.Synth().toDestination();
      
      // Play a note
      synth.triggerAttackRelease("C4", "8n");
      
      toast({
        title: "Test sound played",
        description: "If you didn't hear anything, check your volume settings",
        status: "info",
        duration: 3000,
      });
      
      // Dispose of the synth after a short delay
      setTimeout(() => {
        synth.dispose();
      }, 1000);
    } catch (error) {
      console.error("Error playing test sound:", error);
      toast({
        title: "Audio Error",
        description: "Could not play test sound. Try clicking again.",
        status: "error",
        duration: 3000,
      });
    }
  };
  
  return (
    <Button
      leftIcon={<FaVolumeUp />}
      colorScheme="teal"
      variant="outline"
      size="sm"
      onClick={playTestSound}
    >
      Test Sound
    </Button>
  );
};

export default TestSoundButton;