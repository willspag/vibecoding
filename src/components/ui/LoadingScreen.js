import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const wave = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
`;

const LoadingScreen = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      bg="gray.900"
      color="white"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="9999"
    >
      <Box
        animation={`${pulse} 2s infinite ease-in-out`}
        mb={8}
        fontSize="6xl"
        fontWeight="bold"
      >
        SoundScape
      </Box>
      
      <Flex>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            w="20px"
            h="20px"
            borderRadius="full"
            bg="brand.400"
            mx={1}
            animation={`${wave} 1.5s infinite ease-in-out ${i * 0.1}s`}
          />
        ))}
      </Flex>
      
      <Text mt={8} fontSize="lg" opacity={0.8}>
        Loading your audio experience...
      </Text>
    </Flex>
  );
};

export default LoadingScreen; 