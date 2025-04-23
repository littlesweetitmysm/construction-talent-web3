import { Box, Text, VStack } from '@chakra-ui/react';

const Logo = ({ size = 'xl' }) => {
  return (
    <VStack spacing={2}>
      <Box
        w={size === 'xl' ? '120px' : '80px'}
        h={size === 'xl' ? '120px' : '80px'}
        borderRadius="full"
        bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 0 20px rgba(59, 130, 246, 0.5)"
      >
        <Text
          fontSize={size === 'xl' ? '4xl' : '2xl'}
          fontWeight="bold"
          color="white"
        >
          C
        </Text>
      </Box>
      <Text
        fontSize={size === 'xl' ? '4xl' : '2xl'}
        fontWeight="bold"
        bgGradient="linear(to-r, blue.400, purple.500)"
        bgClip="text"
      >
        Construction
      </Text>
      <Text
        fontSize={size === 'xl' ? '3xl' : 'xl'}
        fontWeight="bold"
        color="white"
      >
        Talent Web3
      </Text>
    </VStack>
  );
};

export default Logo; 