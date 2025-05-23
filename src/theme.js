import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'light' ? 'gray.50' : 'gray.900',
        color: props.colorMode === 'light' ? 'gray.800' : 'white',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: (props) => ({
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s',
      }),
    },
    Card: {
      baseStyle: (props) => ({
        bg: props.colorMode === 'light' ? 'white' : 'gray.800',
        borderRadius: 'xl',
        boxShadow: 'xl',
        borderWidth: '1px',
        borderColor: props.colorMode === 'light' ? 'gray.200' : 'gray.700',
      }),
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: props.colorMode === 'light' ? 'white' : 'gray.800',
        },
      }),
    },
  },
  gradients: {
    light: 'linear(to-r, blue.100, purple.100)',
    dark: 'linear(to-r, blue.900, purple.900)',
  },
});

export default theme; 