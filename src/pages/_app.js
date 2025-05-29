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

  // Always use the same image
  const backgroundImage = "url('/images/cityscape-bg.jpg')";
  // Overlay: light in light mode, dark in dark mode
  const overlay = useColorModeValue(
    'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.85))',
    'linear-gradient(to bottom, rgba(10,10,30,0.85), rgba(0,0,0,0.92))'
  );

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
          backgroundImage: backgroundImage,
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
          bg: overlay,
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