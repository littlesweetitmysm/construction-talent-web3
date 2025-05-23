import { IconButton, useColorMode, Box } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      position="fixed"
      bottom="2rem"
      right="2rem"
      zIndex={100}
    >
      <IconButton
        onClick={toggleColorMode}
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        size="lg"
        colorScheme={colorMode === 'light' ? 'gray' : 'yellow'}
        rounded="full"
        boxShadow="lg"
        _hover={{
          transform: 'scale(1.1)',
          boxShadow: 'xl',
        }}
        transition="all 0.2s"
      />
    </Box>
  );
};

export default ThemeToggle; 