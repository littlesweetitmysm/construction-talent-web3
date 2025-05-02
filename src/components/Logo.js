import { Box, Text, HStack } from '@chakra-ui/react';

const Logo = ({ size = 'xl' }) => {
  const isLarge = size === 'xl';
  return (
    <HStack spacing={isLarge ? 8 : 4} align="center">
      <Box
        w={isLarge ? '160px' : '40px'}
        h={isLarge ? '160px' : '40px'}
        borderRadius="full"
        position="relative"
        overflow="hidden"
        bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
        backgroundSize="200% 200%"
        sx={{
          animation: 'gradient 8s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 0 60px rgba(66, 153, 225, 0.5)"
        _before={{
          content: '""',
          position: 'absolute',
          top: '4px',
          right: '4px',
          bottom: '4px',
          left: '4px',
          borderRadius: 'full',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Text
          fontSize={isLarge ? '6xl' : '2xl'}
          fontWeight="bold"
          color="white"
          position="relative"
          zIndex={1}
          textShadow="3px 3px 6px rgba(0, 0, 0, 0.4)"
        >
          CT
        </Text>
      </Box>
      <Box>
        <Text
          fontSize={isLarge ? '5xl' : 'xl'}
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
          bgClip="text"
          letterSpacing="tight"
          lineHeight="1"
        >
          Construction
        </Text>
        <Text
          fontSize={isLarge ? '4xl' : 'lg'}
          fontWeight="bold"
          color="white"
          textShadow="3px 3px 6px rgba(0, 0, 0, 0.3)"
          letterSpacing="wide"
          lineHeight="1"
        >
          Talent Web3
        </Text>
      </Box>
    </HStack>
  );
};

export default Logo; 