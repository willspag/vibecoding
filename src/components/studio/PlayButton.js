import React, { useState } from 'react';
import { IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useAudio } from '../../context/AudioContext';
import * as Tone from 'tone';

const PlayButton = () => {
  const { isPlaying, togglePlay, isAudioInitialized, initializeAudio } = useAudio();
  const [isInitializing, setIsInitializing] = useState(false);
  const toast = useToast();

  const handleClick = async () => {
    try {
      // First, ensure audio context is running
      await Tone.start();
      
      if (!isAudioInitialized) {
        setIsInitializing(true);
        try {
          await initializeAudio();
          toast({
            title: "Audio initialized",
            status: "success",
            duration: 2000,
          });
        } catch (error) {
          console.error("Failed to initialize audio:", error);
          toast({
            title: "Failed to initialize audio",
            description: error.message,
            status: "error",
            duration: 3000,
          });
          return;
        } finally {
          setIsInitializing(false);
        }
      }
      
      // Now toggle play state
      togglePlay();
    } catch (error) {
      console.error("Error starting audio context:", error);
      toast({
        title: "Audio Error",
        description: "Please click again to enable audio",
        status: "warning",
        duration: 3000,
      });
    }
  };

  return (
    <Tooltip label={isPlaying ? 'Pause' : 'Play'}>
      <IconButton
        aria-label={isPlaying ? 'Pause' : 'Play'}
        icon={isPlaying ? <FaPause /> : <FaPlay />}
        colorScheme="blue"
        size="lg"
        isRound
        onClick={handleClick}
        isLoading={isInitializing}
      />
    </Tooltip>
  );
};

export default PlayButton; 