import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#000',
        color: 'white',
      },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
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

const GlobalStyles = css`
  body {
    min-height: 100vh;
    background: linear-gradient(
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.9)
    ),
    url('/images/cityscape-bg.jpg') no-repeat center center fixed;
    background-size: cover;
    color: white;
  }

  #__next {
    min-height: 100vh;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Global styles={GlobalStyles} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp; 