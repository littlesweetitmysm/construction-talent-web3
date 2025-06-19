import { ChakraProvider, Box, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import theme from '../theme';
import ThemeToggle from '../components/ThemeToggle';
import { useEffect } from 'react';

function AppContainer({ children }) {
  const backgroundImage = "url('/images/cityscape-bg.jpg')";
  const overlay = useColorModeValue(
    'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.85))',
    'linear-gradient(to bottom, rgba(10,10,30,0.85), rgba(0,0,0,0.92))'
  );
  const { colorMode } = useColorMode();

  useEffect(() => {
    console.log('Overlay value:', overlay);
  }, [overlay]);

  return (
    <Box
      key={colorMode}
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
      {children}
      <ThemeToggle />
    </Box>
  );
}

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
    <ChakraProvider theme={theme} toastOptions={{ defaultOptions: { position: 'top-right' } }}>
      <Global styles={GlobalStyles} />
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
    </ChakraProvider>
  );
}

export default MyApp; 