import { ChakraProvider, Box, useColorModeValue } from '@chakra-ui/react';
import theme from '../theme';
import ThemeToggle from '../components/ThemeToggle';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Box
        minH="100vh"
        bgGradient={useColorModeValue(
          'linear(to-br, blue.50, purple.50)',
          'linear(to-br, gray.900, purple.900)'
        )}
        transition="background 0.2s ease"
      >
        <Component {...pageProps} />
        <ThemeToggle />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp; 