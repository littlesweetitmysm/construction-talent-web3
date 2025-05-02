import { Box, Text, HStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Logo = ({ size = 'xl' }) => {
  const isLarge = size === 'xl';
  return (
    <HStack spacing={4} align="center">
      <Box
        w={isLarge ? '80px' : '40px'}
        h={isLarge ? '80px' : '40px'}
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
          fontSize={isLarge ? '4xl' : '2xl'}
          fontWeight="bold"
          color="white"
          position="relative"
          zIndex={1}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
        >
          CT
        </Text>
      </Box>
      <Box>
        <Text
          fontSize={isLarge ? '3xl' : 'xl'}
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
          bgClip="text"
          letterSpacing="tight"
          lineHeight="1"
        >
          Construction
        </Text>
        <Text
          fontSize={isLarge ? '2xl' : 'lg'}
          fontWeight="bold"
          color="white"
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.2)"
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