import { Box, Text, VStack, keyframes } from '@chakra-ui/react';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Logo = ({ size = 'xl' }) => {
  return (
    <VStack spacing={4}>
      <Box
        w={size === 'xl' ? '160px' : '120px'}
        h={size === 'xl' ? '160px' : '120px'}
        borderRadius="full"
        position="relative"
        overflow="hidden"
        bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
        backgroundSize="200% 200%"
        animation={`${gradientAnimation} 8s ease infinite`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 0 40px rgba(66, 153, 225, 0.4)"
        _before={{
          content: '""',
          position: 'absolute',
          top: '2px',
          right: '2px',
          bottom: '2px',
          left: '2px',
          borderRadius: 'full',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Text
          fontSize={size === 'xl' ? '6xl' : '4xl'}
          fontWeight="bold"
          color="white"
          position="relative"
          zIndex={1}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
        >
          CT
        </Text>
      </Box>
      <Text
        fontSize={size === 'xl' ? '5xl' : '3xl'}
        fontWeight="bold"
        bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
        bgClip="text"
        letterSpacing="tight"
      >
        Construction
      </Text>
      <Text
        fontSize={size === 'xl' ? '4xl' : '2xl'}
        fontWeight="bold"
        color="white"
        textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)"
        letterSpacing="wide"
      >
        Talent Web3
      </Text>
    </VStack>
  );
};

export default Logo; 