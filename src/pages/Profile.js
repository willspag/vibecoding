import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Container,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Image,
  IconButton,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaHeart, FaEdit, FaTrash, FaMusic, FaUserFriends, FaRegStar } from 'react-icons/fa';

// Mock user data
const USER = {
  name: 'Alex Johnson',
  username: 'musiccreator',
  avatar: 'https://bit.ly/dan-abramov',
  bio: 'Music enthusiast and creator. I love experimenting with different sounds and genres.',
  joinedDate: 'April 2023',
  stats: {
    creations: 8,
    followers: 124,
    following: 56,
    likes: 342,
  },
};

// Mock user creations
const USER_CREATIONS = [
  {
    id: 1,
    title: 'Summer Vibes',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 42,
    plays: 156,
    tags: ['summer', 'chill', 'electronic'],
    createdAt: '2023-04-15T14:30:00Z',
  },
  {
    id: 2,
    title: 'Midnight Dreams',
    coverImage: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 28,
    plays: 98,
    tags: ['night', 'ambient', 'dream'],
    createdAt: '2023-04-10T23:15:00Z',
  },
  {
    id: 3,
    title: 'Urban Rhythm',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 35,
    plays: 127,
    tags: ['urban', 'rhythm', 'beats'],
    createdAt: '2023-04-05T18:45:00Z',
  },
];

// Mock liked creations
const LIKED_CREATIONS = [
  {
    id: 4,
    title: 'Ocean Waves',
    author: 'WaveMaker',
    coverImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 87,
    plays: 245,
    tags: ['ocean', 'waves', 'relaxing'],
    createdAt: '2023-04-12T09:20:00Z',
  },
  {
    id: 5,
    title: 'City Lights',
    author: 'NightOwl',
    coverImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 64,
    plays: 189,
    tags: ['city', 'night', 'ambient'],
    createdAt: '2023-04-08T21:30:00Z',
  },
];

const Profile = () => {
  const [playingId, setPlayingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  // Toggle play/pause for a creation
  const togglePlay = (id) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle edit creation
  const handleEdit = (id) => {
    // In a real app, this would navigate to the studio with the creation loaded
    toast({
      title: 'Edit Creation',
      description: `Opening creation #${id} in the studio.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle delete creation
  const handleDelete = (id) => {
    // In a real app, this would show a confirmation dialog and then delete
    toast({
      title: 'Delete Creation',
      description: `Creation #${id} has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'center', md: 'flex-start' }}
            justify="space-between"
            bg={useColorModeValue('white', 'gray.800')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              mb={{ base: 4, md: 0 }}
            >
              <Avatar
                size="2xl"
                src={USER.avatar}
                name={USER.name}
                mr={{ base: 0, md: 6 }}
                mb={{ base: 4, md: 0 }}
              />
              <Box textAlign={{ base: 'center', md: 'left' }}>
                <Heading size="lg">{USER.name}</Heading>
                <Text color="gray.500" mb={2}>
                  @{USER.username}
                </Text>
                <Text maxW="400px" mb={3}>
                  {USER.bio}
                </Text>
                <HStack spacing={2}>
                  <Badge colorScheme="blue">Creator</Badge>
                  <Badge colorScheme="green">Member since {USER.joinedDate}</Badge>
                </HStack>
              </Box>
            </Flex>

            <StatGroup
              maxW={{ base: 'full', md: '300px' }}
              textAlign="center"
              borderRadius="md"
              p={3}
              bg={useColorModeValue('gray.50', 'gray.700')}
            >
              <Stat>
                <StatLabel>Creations</StatLabel>
                <StatNumber>{USER.stats.creations}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Followers</StatLabel>
                <StatNumber>{USER.stats.followers}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Following</StatLabel>
                <StatNumber>{USER.stats.following}</StatNumber>
              </Stat>
            </StatGroup>
          </Flex>

          {/* Profile Content */}
          <Tabs
            isFitted
            variant="enclosed"
            colorScheme="blue"
            onChange={(index) => setActiveTab(index)}
          >
            <TabList mb="1em">
              <Tab>
                <Flex align="center">
                  <FaMusic style={{ marginRight: '8px' }} />
                  My Creations
                </Flex>
              </Tab>
              <Tab>
                <Flex align="center">
                  <FaHeart style={{ marginRight: '8px' }} />
                  Liked
                </Flex>
              </Tab>
              <Tab>
                <Flex align="center">
                  <FaUserFriends style={{ marginRight: '8px' }} />
                  Following
                </Flex>
              </Tab>
            </TabList>
            <TabPanels>
              {/* My Creations Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Heading size="md">My Creations</Heading>
                    <Button
                      leftIcon={<FaMusic />}
                      colorScheme="blue"
                      size="sm"
                      as="a"
                      href="/studio"
                    >
                      Create New
                    </Button>
                  </Flex>
                  <Divider />
                  {USER_CREATIONS.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      {USER_CREATIONS.map((creation) => (
                        <Box
                          key={creation.id}
                          borderRadius="lg"
                          overflow="hidden"
                          bg={useColorModeValue('white', 'gray.700')}
                          boxShadow="md"
                        >
                          <Box position="relative">
                            <Image
                              src={creation.coverImage}
                              alt={creation.title}
                              objectFit="cover"
                              height="180px"
                              width="100%"
                            />
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              right="0"
                              bottom="0"
                              bg="blackAlpha.60"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              opacity="0"
                              _hover={{ opacity: 1 }}
                              transition="all 0.3s"
                            >
                              <IconButton
                                aria-label={playingId === creation.id ? 'Pause' : 'Play'}
                                icon={playingId === creation.id ? <FaPause /> : <FaPlay />}
                                size="lg"
                                colorScheme="brand"
                                variant="solid"
                                isRound
                                onClick={() => togglePlay(creation.id)}
                                mr={2}
                              />
                              <IconButton
                                aria-label="Edit"
                                icon={<FaEdit />}
                                size="lg"
                                colorScheme="blue"
                                variant="solid"
                                isRound
                                onClick={() => handleEdit(creation.id)}
                                mr={2}
                              />
                              <IconButton
                                aria-label="Delete"
                                icon={<FaTrash />}
                                size="lg"
                                colorScheme="red"
                                variant="solid"
                                isRound
                                onClick={() => handleDelete(creation.id)}
                              />
                            </Box>
                          </Box>
                          <Box p={4}>
                            <Heading as="h3" size="md" mb={2}>
                              {creation.title}
                            </Heading>
                            <HStack spacing={2} mb={3}>
                              {creation.tags.map((tag) => (
                                <Badge key={tag} colorScheme="brand" variant="subtle">
                                  {tag}
                                </Badge>
                              ))}
                            </HStack>
                            <Flex justify="space-between" align="center" fontSize="sm" color="gray.500">
                              <Text>{formatDate(creation.createdAt)}</Text>
                              <HStack spacing={3}>
                                <Flex align="center">
                                  <FaPlay size="0.8em" />
                                  <Text ml={1}>{creation.plays}</Text>
                                </Flex>
                                <Flex align="center">
                                  <FaHeart size="0.8em" />
                                  <Text ml={1}>{creation.likes}</Text>
                                </Flex>
                              </HStack>
                            </Flex>
                          </Box>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box
                      textAlign="center"
                      py={10}
                      px={6}
                      borderRadius="lg"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                    >
                      <Heading as="h3" size="md" mb={2}>
                        No creations yet
                      </Heading>
                      <Text color="gray.500" mb={4}>
                        Start creating your first music piece in the studio.
                      </Text>
                      <Button
                        leftIcon={<FaMusic />}
                        colorScheme="blue"
                        as="a"
                        href="/studio"
                      >
                        Go to Studio
                      </Button>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* Liked Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Liked Creations</Heading>
                  <Divider />
                  {LIKED_CREATIONS.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      {LIKED_CREATIONS.map((creation) => (
                        <Box
                          key={creation.id}
                          borderRadius="lg"
                          overflow="hidden"
                          bg={useColorModeValue('white', 'gray.700')}
                          boxShadow="md"
                        >
                          <Box position="relative">
                            <Image
                              src={creation.coverImage}
                              alt={creation.title}
                              objectFit="cover"
                              height="180px"
                              width="100%"
                            />
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              right="0"
                              bottom="0"
                              bg="blackAlpha.60"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              opacity="0"
                              _hover={{ opacity: 1 }}
                              transition="all 0.3s"
                            >
                              <IconButton
                                aria-label={playingId === creation.id ? 'Pause' : 'Play'}
                                icon={playingId === creation.id ? <FaPause /> : <FaPlay />}
                                size="lg"
                                colorScheme="brand"
                                variant="solid"
                                isRound
                                onClick={() => togglePlay(creation.id)}
                              />
                            </Box>
                          </Box>
                          <Box p={4}>
                            <Heading as="h3" size="md" mb={1}>
                              {creation.title}
                            </Heading>
                            <Text fontSize="sm" color="gray.500" mb={2}>
                              by {creation.author}
                            </Text>
                            <HStack spacing={2} mb={3}>
                              {creation.tags.map((tag) => (
                                <Badge key={tag} colorScheme="brand" variant="subtle">
                                  {tag}
                                </Badge>
                              ))}
                            </HStack>
                            <Flex justify="space-between" align="center" fontSize="sm" color="gray.500">
                              <Text>{formatDate(creation.createdAt)}</Text>
                              <HStack spacing={3}>
                                <Flex align="center">
                                  <FaPlay size="0.8em" />
                                  <Text ml={1}>{creation.plays}</Text>
                                </Flex>
                                <Flex align="center">
                                  <FaHeart size="0.8em" />
                                  <Text ml={1}>{creation.likes}</Text>
                                </Flex>
                              </HStack>
                            </Flex>
                          </Box>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box
                      textAlign="center"
                      py={10}
                      px={6}
                      borderRadius="lg"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                    >
                      <Heading as="h3" size="md" mb={2}>
                        No liked creations
                      </Heading>
                      <Text color="gray.500" mb={4}>
                        Explore the community to find and like creations.
                      </Text>
                      <Button
                        leftIcon={<FaRegStar />}
                        colorScheme="blue"
                        as="a"
                        href="/explore"
                      >
                        Explore
                      </Button>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* Following Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Following</Heading>
                  <Divider />
                  <Box
                    textAlign="center"
                    py={10}
                    px={6}
                    borderRadius="lg"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                  >
                    <Heading as="h3" size="md" mb={2}>
                      Coming Soon
                    </Heading>
                    <Text color="gray.500">
                      We're working on the social features. Stay tuned!
                    </Text>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile; 