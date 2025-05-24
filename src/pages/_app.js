import { ChakraProvider, Box, useColorModeValue } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import theme from '../theme';
import ThemeToggle from '../components/ThemeToggle';

function MyApp({ Component, pageProps }) {
  const GlobalStyles = css`
    body {
      min-height: 100vh;
      background-size: cover !important;
      background-position: center center !important;
      background-attachment: fixed !important;
    }
  `;

  return (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <Box
        minH="100vh"
        position="relative"
        _before={{
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: useColorModeValue(
            "url('/images/cityscape-day.jpg')",
            "url('/images/cityscape-night.jpg')"
          ),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2,
        }}
        _after={{
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: useColorModeValue(
            'linear(to-br, rgba(255, 255, 255, 0.8), rgba(200, 220, 255, 0.8))',
            'linear(to-br, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.9))'
          ),
          zIndex: -1,
        }}
      >
        <Component {...pageProps} />
        <ThemeToggle />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp; 