import { Box, Text, HStack, VStack } from '@chakra-ui/react';

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
        boxShadow="0 0 20px rgba(66, 153, 225, 0.5)"
      >
        <Text
          fontSize={isLarge ? '6xl' : '2xl'}
          fontWeight="bold"
          color="white"
          textShadow="2px 2px 4px rgba(0,0,0,0.3)"
        >
          CT
        </Text>
      </Box>
      {isLarge && (
        <VStack align="start" spacing={0}>
          <Text
            fontSize="5xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
          >
            Construction
          </Text>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            bgGradient="linear(to-r, purple.500, pink.500)"
            bgClip="text"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
          >
            Talent Web3
          </Text>
        </VStack>
      )}
    </HStack>
  );
};

export default Logo; 