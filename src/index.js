import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Poppins, sans-serif',
  },
  colors: {
    brand: {
      50: '#e0f7ff',
      100: '#b8e4ff',
      200: '#8dd0ff',
      300: '#61bcff',
      400: '#36a9ff',
      500: '#1c8fe6',
      600: '#0070b4',
      700: '#005182',
      800: '#003252',
      900: '#001223',
    },
    accent: {
      50: '#ffe0fb',
      100: '#ffb1f1',
      200: '#ff81e8',
      300: '#ff51de',
      400: '#ff22d4',
      500: '#e609bb',
      600: '#b30092',
      700: '#810069',
      800: '#4f0041',
      900: '#1f001a',
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 