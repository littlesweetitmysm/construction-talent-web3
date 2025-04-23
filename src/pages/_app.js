import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)),
          url('/cityscape.jpg') no-repeat center center fixed;
        background-size: cover;
        min-height: 100vh;
      }
    `}
  />
);

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'white',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
      },
      variants: {
        solid: {
          bg: 'blue.400',
          color: 'white',
          _hover: {
            bg: 'blue.500',
          },
        },
        outline: {
          borderColor: 'blue.400',
          color: 'white',
          _hover: {
            bg: 'blue.400',
            color: 'white',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'xl',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'white',
      },
    },
    Text: {
      baseStyle: {
        color: 'white',
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp; 