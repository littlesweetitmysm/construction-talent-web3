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
        backgroundSize="300% 300%"
        sx={{
          animation: 'gradient 3s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 0 30px rgba(66, 153, 225, 0.6)"
        _hover={{
          boxShadow: "0 0 40px rgba(66, 153, 225, 0.8)",
          transform: "scale(1.05)",
          transition: "all 0.3s ease",
          animation: "rotateOnce 0.5s ease-out forwards",
          '@keyframes rotateOnce': {
            '0%': { transform: 'rotate(0deg) scale(1.05)' },
            '100%': { transform: 'rotate(360deg) scale(1.05)' }
          }
        }}
      >
        <Text
          fontSize={isLarge ? '6xl' : '2xl'}
          fontWeight="bold"
          color="white"
          textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          sx={{
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' }
            }
          }}
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
            sx={{
              animation: 'slideIn 1s ease-out',
              '@keyframes slideIn': {
                '0%': { transform: 'translateX(-20px)', opacity: 0 },
                '100%': { transform: 'translateX(0)', opacity: 1 }
              }
            }}
          >
            Construction
          </Text>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            bgGradient="linear(to-r, purple.500, pink.500)"
            bgClip="text"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
            sx={{
              animation: 'slideIn 1s ease-out 0.3s both',
              '@keyframes slideIn': {
                '0%': { transform: 'translateX(-20px)', opacity: 0 },
                '100%': { transform: 'translateX(0)', opacity: 1 }
              }
            }}
          >
            Talent Web3
          </Text>
        </VStack>
      )}
    </HStack>
  );
};

export default Logo; 