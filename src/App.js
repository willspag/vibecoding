import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, useColorMode } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Studio from './pages/Studio';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';

// Context
import { AudioProvider } from './context/AudioContext';

function App() {
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AudioProvider>
      <Router>
        <Box 
          minH="100vh" 
          bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
          color={colorMode === 'dark' ? 'white' : 'gray.800'}
        >
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </Box>
      </Router>
    </AudioProvider>
  );
}

export default App; 