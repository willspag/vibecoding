import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  Flex,
  Image,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaMusic, FaHeadphones, FaShare, FaLightbulb } from 'react-icons/fa';

const MotionBox = motion(Box);

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            Create music with <br />
            <Text as={'span'} color={'brand.400'}>
              SoundScape
            </Text>
          </Heading>
          <Text color={'gray.500'} fontSize={{ base: 'lg', md: 'xl' }}>
            An immersive, interactive music visualization and creation platform.
            No musical knowledge required. Create beautiful music, visualize it,
            and share it with the world.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Button
              as={RouterLink}
              to="/studio"
              colorScheme={'blue'}
              bg={'brand.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'brand.500',
              }}
              size="lg"
            >
              Start Creating
            </Button>
            <Button
              as={RouterLink}
              to="/explore"
              variant={'link'}
              colorScheme={'blue'}
              size={'sm'}
            >
              Explore Creations
            </Button>
            <Box>
              <Icon
                as={Arrow}
                color={useColorModeValue('gray.800', 'gray.300')}
                w={71}
                position={'absolute'}
                right={-71}
                top={'10px'}
              />
              <Text
                fontSize={'lg'}
                fontFamily={'Caveat'}
                position={'absolute'}
                right={'-125px'}
                top={'-15px'}
                transform={'rotate(10deg)'}
              >
                No signup needed!
              </Text>
            </Box>
          </Stack>
        </Stack>
      </Container>

      {/* Features Section */}
      <Box py={12} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Container maxW={'6xl'}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                rounded={'md'}
                alt={'feature image'}
                src={'https://source.unsplash.com/random/600x400/?music,visualization'}
                objectFit={'cover'}
                boxShadow={'2xl'}
              />
            </MotionBox>
            <Stack spacing={4}>
              <Text
                textTransform={'uppercase'}
                color={'brand.400'}
                fontWeight={600}
                fontSize={'sm'}
                bg={useColorModeValue('brand.50', 'brand.900')}
                p={2}
                alignSelf={'flex-start'}
                rounded={'md'}
              >
                Our Features
              </Text>
              <Heading>A digital music studio for everyone</Heading>
              <Text color={'gray.500'} fontSize={'lg'}>
                SoundScape makes music creation accessible to everyone, regardless
                of musical background or technical knowledge.
              </Text>
              <Stack spacing={4}>
                <Feature
                  icon={<Icon as={FaMusic} color={'yellow.500'} w={5} h={5} />}
                  title={'Intuitive Music Creation'}
                  text={'Create beautiful melodies with our easy-to-use interface.'}
                />
                <Feature
                  icon={<Icon as={FaHeadphones} color={'green.500'} w={5} h={5} />}
                  title={'High-Quality Sound'}
                  text={'Professional-grade synthesizers and effects.'}
                />
                <Feature
                  icon={<Icon as={FaLightbulb} color={'purple.500'} w={5} h={5} />}
                  title={'AI-Assisted Composition'}
                  text={'Get intelligent suggestions to enhance your music.'}
                />
                <Feature
                  icon={<Icon as={FaShare} color={'red.500'} w={5} h={5} />}
                  title={'Share Your Creations'}
                  text={'Export and share your music with friends and the world.'}
                />
              </Stack>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={12}>
        <Container maxW={'6xl'}>
          <VStack spacing={2} textAlign="center" mb={12}>
            <Heading as="h1" fontSize="4xl">
              How It Works
            </Heading>
            <Text fontSize="lg" color={'gray.500'}>
              Create music in three simple steps
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <StepCard
              title="1. Choose Your Instruments"
              description="Select from a variety of instruments and sounds to create your track."
              icon={FaMusic}
              iconBg="brand.100"
            />
            <StepCard
              title="2. Compose Your Melody"
              description="Use our intuitive interface to create beautiful melodies and rhythms."
              icon={FaHeadphones}
              iconBg="brand.100"
            />
            <StepCard
              title="3. Visualize & Share"
              description="Watch your music come to life with stunning visualizations, then share with the world."
              icon={FaShare}
              iconBg="brand.100"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.800')} py={12}>
        <Container maxW={'6xl'}>
          <VStack spacing={2} textAlign="center" mb={12}>
            <Heading as="h1" fontSize="4xl">
              What People Are Saying
            </Heading>
            <Text fontSize="lg" color={'gray.500'}>
              Join thousands of happy users creating music with SoundScape
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <TestimonialCard
              name="Sarah Johnson"
              role="Music Enthusiast"
              content="I've always wanted to create music but had no formal training. SoundScape made it possible for me to express myself musically!"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Professional DJ"
              content="Even as a professional, I find SoundScape incredibly useful for quick ideation and visualization of new tracks. It's become part of my workflow."
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Teacher"
              content="I use SoundScape in my classroom to teach music concepts. The visual aspect helps students understand music in a whole new way!"
              avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={12}>
        <Container maxW={'3xl'}>
          <Stack
            as={Box}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 10, md: 20 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}
            >
              Ready to create <br />
              <Text as={'span'} color={'brand.400'}>
                your own music?
              </Text>
            </Heading>
            <Text color={'gray.500'} fontSize={{ base: 'lg', md: 'xl' }}>
              Join thousands of users who are already creating and sharing
              beautiful music with SoundScape. No musical knowledge required!
            </Text>
            <Stack
              direction={'column'}
              spacing={3}
              align={'center'}
              alignSelf={'center'}
              position={'relative'}
            >
              <Button
                as={RouterLink}
                to="/studio"
                colorScheme={'blue'}
                bg={'brand.400'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'brand.500',
                }}
                size="lg"
              >
                Get Started Now
              </Button>
              <Button
                as={RouterLink}
                to="/explore"
                variant={'link'}
                colorScheme={'blue'}
                size={'sm'}
              >
                See What Others Have Created
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

const Feature = ({ title, text, icon }) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex
        w={8}
        h={8}
        align={'center'}
        justify={'center'}
        rounded={'full'}
        bg={useColorModeValue('gray.100', 'gray.700')}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.500'}>{text}</Text>
    </Stack>
  );
};

const StepCard = ({ title, description, icon, iconBg }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'all .2s ease',
      }}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={iconBg}
        mb={5}
      >
        <Icon as={icon} w={10} h={10} />
      </Flex>
      <Heading fontSize={'xl'} fontFamily={'body'} textAlign="center">
        {title}
      </Heading>
      <Text fontSize={'md'} color={'gray.500'} textAlign="center">
        {description}
      </Text>
    </Stack>
  );
};

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'all .2s ease',
      }}
    >
      <Text
        textAlign={'center'}
        color={useColorModeValue('gray.600', 'gray.400')}
        fontSize={'sm'}
      >
        {content}
      </Text>
      <Stack mt={8} direction={'row'} spacing={4} align={'center'}>
        <Image
          alt={'Author'}
          borderRadius={'full'}
          boxSize={'50px'}
          src={avatar}
        />
        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
          <Text fontWeight={600}>{name}</Text>
          <Text color={'gray.500'}>{role}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
});

export default Home; 