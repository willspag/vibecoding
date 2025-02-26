import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Text, Select, HStack, useColorModeValue } from '@chakra-ui/react';
import { useAudio } from '../../context/AudioContext';
import * as Tone from 'tone';

const Visualizer = () => {
  const canvasRef = useRef(null);
  const { isPlaying, isAudioInitialized } = useAudio();
  const [visualizerType, setVisualizerType] = useState('waveform');
  const [analyzer, setAnalyzer] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const animationFrameRef = useRef(null);
  
  // Move all color values to the top level of the component
  const staticBgColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)');
  const staticTextColor = useColorModeValue('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.5)');
  const waveformStrokeColor = useColorModeValue('rgba(54, 169, 255, 0.8)', 'rgba(54, 169, 255, 0.8)');
  const circularStrokeColor = useColorModeValue('rgba(54, 169, 255, 0.8)', 'rgba(54, 169, 255, 0.8)');
  const circularBgColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Draw waveform visualization
  const drawWaveform = useCallback((ctx, dataArray, width, height) => {
    if (!ctx || !dataArray) return;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = waveformStrokeColor;
    ctx.clearRect(0, 0, width, height);
    
    const sliceWidth = width / dataArray.length;
    let x = 0;
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i];
      const y = (v * height / 2) + height / 2;
      
      ctx.lineTo(x, y);
      x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }, [waveformStrokeColor]);
  
  // Draw circular visualization
  const drawCircular = useCallback((ctx, dataArray, width, height) => {
    if (!ctx || !dataArray) return;
    
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Ensure radius is positive and reasonable
    const minDimension = Math.min(width, height);
    const radius = Math.max(10, minDimension / 2 - 10); // Ensure minimum radius of 10px
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = circularBgColor;
    ctx.fill();
    
    // Draw data points
    const angleStep = (2 * Math.PI) / dataArray.length;
    
    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      // Ensure radius is positive
      const adjustedRadius = Math.max(5, radius * (0.5 + value * 0.5));
      
      const x = centerX + adjustedRadius * Math.cos(i * angleStep);
      const y = centerY + adjustedRadius * Math.sin(i * angleStep);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.strokeStyle = circularStrokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [circularBgColor, circularStrokeColor]);
  
  // Initialize analyzer
  useEffect(() => {
    if (!isAudioInitialized) return;
    
    // Create analyzer if it doesn't exist
    if (!analyzer) {
      try {
        const newAnalyzer = new Tone.Analyser('waveform', 128);
        Tone.Destination.connect(newAnalyzer);
        setAnalyzer(newAnalyzer);
        setDataArray(newAnalyzer.getValue());
      } catch (error) {
        console.error('Failed to create analyzer:', error);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAudioInitialized, analyzer]);
  
  // Animation loop
  useEffect(() => {
    if (!analyzer || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Make sure canvas dimensions are set
    if (canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth || 300;
      canvas.height = canvas.parentElement.clientHeight || 200;
    }
    
    const animate = () => {
      try {
        const data = analyzer.getValue();
        setDataArray(data);
        
        if (visualizerType === 'waveform') {
          drawWaveform(ctx, data, canvas.width, canvas.height);
        } else if (visualizerType === 'circular') {
          drawCircular(ctx, data, canvas.width, canvas.height);
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Visualizer error:', error);
      }
    };
    
    // Start animation if playing
    if (isPlaying) {
      animate();
    } else {
      // Draw static visualization when not playing
      if (dataArray) {
        if (visualizerType === 'waveform') {
          drawWaveform(ctx, dataArray, canvas.width, canvas.height);
        } else if (visualizerType === 'circular') {
          drawCircular(ctx, dataArray, canvas.width, canvas.height);
        }
      } else {
        // Draw placeholder
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = staticBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = staticTextColor;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Play to see visualization', canvas.width / 2, canvas.height / 2);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyzer, canvasRef, dataArray, drawCircular, drawWaveform, isPlaying, staticBgColor, staticTextColor, visualizerType]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth || 300;
      canvas.height = container.clientHeight || 200;
      
      // Redraw
      if (dataArray) {
        const ctx = canvas.getContext('2d');
        if (visualizerType === 'waveform') {
          drawWaveform(ctx, dataArray, canvas.width, canvas.height);
        } else if (visualizerType === 'circular') {
          drawCircular(ctx, dataArray, canvas.width, canvas.height);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataArray, visualizerType, drawWaveform, drawCircular]);
  
  return (
    <Box>
      <HStack mb={2} justify="space-between">
        <Text fontSize="sm" fontWeight="bold">Visualizer</Text>
        <Select
          size="sm"
          width="120px"
          value={visualizerType}
          onChange={(e) => setVisualizerType(e.target.value)}
        >
          <option value="waveform">Waveform</option>
          <option value="circular">Circular</option>
        </Select>
      </HStack>
      <Box
        position="relative"
        height="200px"
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        bg={bgColor}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </Box>
  );
};

export default Visualizer; 