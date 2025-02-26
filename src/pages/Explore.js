import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Button,
  Badge,
  Image,
  useColorModeValue,
  Container,
  VStack,
  HStack,
  Avatar,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaSearch, FaHeart, FaPlay, FaPause, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Mock data for community creations
const MOCK_CREATIONS = [
  {
    id: 1,
    title: 'Sunset Waves',
    author: 'MusicLover42',
    authorAvatar: 'https://bit.ly/ryan-florence',
    coverImage: 'https://images.unsplash.com/photo-1518911710364-17ec553bde5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 423,
    plays: 1205,
    tags: ['ambient', 'chill', 'electronic'],
    createdAt: '2023-04-10T12:00:00Z',
  },
  {
    id: 2,
    title: 'Urban Jungle',
    author: 'BeatMaster',
    authorAvatar: 'https://bit.ly/sage-adebayo',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 218,
    plays: 876,
    tags: ['hip-hop', 'beats', 'urban'],
    createdAt: '2023-04-08T15:30:00Z',
  },
  {
    id: 3,
    title: 'Cosmic Journey',
    author: 'StarGazer',
    authorAvatar: 'https://bit.ly/kent-c-dodds',
    coverImage: 'https://images.unsplash.com/photo-1539593395743-7da5ee10ff07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 512,
    plays: 1876,
    tags: ['space', 'ambient', 'electronic'],
    createdAt: '2023-04-05T09:15:00Z',
  },
  {
    id: 4,
    title: 'Morning Dew',
    author: 'NatureSounds',
    authorAvatar: 'https://bit.ly/prosper-baba',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 189,
    plays: 723,
    tags: ['nature', 'peaceful', 'morning'],
    createdAt: '2023-04-02T07:45:00Z',
  },
  {
    id: 5,
    title: 'Neon Lights',
    author: 'CyberPunk',
    authorAvatar: 'https://bit.ly/code-beast',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 345,
    plays: 1432,
    tags: ['cyberpunk', 'electronic', 'synth'],
    createdAt: '2023-03-28T22:10:00Z',
  },
  {
    id: 6,
    title: 'Rainy Day',
    author: 'MoodMaker',
    authorAvatar: 'https://bit.ly/dan-abramov',
    coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 276,
    plays: 987,
    tags: ['rain', 'lofi', 'chill'],
    createdAt: '2023-03-25T14:20:00Z',
  },
];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredCreations, setFilteredCreations] = useState(MOCK_CREATIONS);
  const [playingId, setPlayingId] = useState(null);
  const [likedCreations, setLikedCreations] = useState([]);

  // Filter and sort creations based on search term and sort option
  useEffect(() => {
    let result = [...MOCK_CREATIONS];
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        creation => 
          creation.title.toLowerCase().includes(lowerCaseSearch) ||
          creation.author.toLowerCase().includes(lowerCaseSearch) ||
          creation.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostLiked':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'mostPlayed':
        result.sort((a, b) => b.plays - a.plays);
        break;
      default:
        break;
    }
    
    setFilteredCreations(result);
  }, [searchTerm, sortBy]);

  // Toggle play/pause for a creation
  const togglePlay = (id) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  // Toggle like for a creation
  const toggleLike = (id) => {
    if (likedCreations.includes(id)) {
      setLikedCreations(likedCreations.filter(creationId => creationId !== id));
    } else {
      setLikedCreations([...likedCreations, id]);
    }
  };

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  return (
    <Box p={4}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl">
            Explore Creations
          </Heading>
          
          <Text color="gray.500">
            Discover music created by the SoundScape community. Get inspired, play, and share your favorites.
          </Text>
          
          {/* Search and Filter */}
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            gap={4}
            align={{ base: 'stretch', md: 'center' }}
          >
            <InputGroup flex="1">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search by title, creator, or tag" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Select 
              width={{ base: '100%', md: '200px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
              <option value="mostPlayed">Most Played</option>
            </Select>
          </Flex>
          
          {/* Results */}
          {filteredCreations.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
              {filteredCreations.map((creation) => (
                <MotionBox
                  key={creation.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    borderRadius="lg"
                    overflow="hidden"
                    bg={useColorModeValue('white', 'gray.800')}
                    boxShadow="md"
                  >
                    <Box position="relative">
                      <Image
                        src={creation.coverImage}
                        alt={creation.title}
                        objectFit="cover"
                        height="200px"
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
                      <Flex justify="space-between" align="center" mb={2}>
                        <Heading as="h3" size="md" noOfLines={1}>
                          {creation.title}
                        </Heading>
                        <Tooltip label={likedCreations.includes(creation.id) ? 'Unlike' : 'Like'}>
                          <IconButton
                            aria-label="Like"
                            icon={<FaHeart />}
                            size="sm"
                            variant="ghost"
                            colorScheme={likedCreations.includes(creation.id) ? 'red' : 'gray'}
                            onClick={() => toggleLike(creation.id)}
                          />
                        </Tooltip>
                      </Flex>
                      
                      <Flex align="center" mb={3}>
                        <Avatar size="xs" src={creation.authorAvatar} mr={2} />
                        <Text fontSize="sm" fontWeight="medium">
                          {creation.author}
                        </Text>
                      </Flex>
                      
                      <HStack spacing={2} mb={3}>
                        {creation.tags.map((tag) => (
                          <Badge key={tag} colorScheme="brand" variant="subtle">
                            {tag}
                          </Badge>
                        ))}
                      </HStack>
                      
                      <Flex justify="space-between" align="center" fontSize="sm" color="gray.500">
                        <Text>{formatRelativeTime(creation.createdAt)}</Text>
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
                </MotionBox>
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
              <Heading as="h2" size="lg" mb={2}>
                No results found
              </Heading>
              <Text color="gray.500">
                Try adjusting your search or filter to find what you're looking for.
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Explore; 