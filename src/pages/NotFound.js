import React from 'react';
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Flex
      align="center"
      justify="center"
      minHeight="70vh"
      direction="column"
      p={5}
    >
      <Heading
        display="inline-block"
        as="h1"
        size="4xl"
        bgGradient="linear(to-r, brand.400, accent.400)"
        backgroundClip="text"
        mb={4}
      >
        404
      </Heading>
      <Text fontSize="xl" mb={6} textAlign="center">
        Page Not Found
      </Text>
      <Text color={'gray.500'} mb={6} textAlign="center">
        The page you're looking for doesn't seem to exist.
      </Text>
      <Button
        as={RouterLink}
        to="/"
        colorScheme="blue"
        bgGradient="linear(to-r, brand.400, accent.400)"
        color="white"
        variant="solid"
        _hover={{
          bgGradient: 'linear(to-r, brand.500, accent.500)',
        }}
      >
        Go to Home
      </Button>
    </Flex>
  );
};

export default NotFound; 