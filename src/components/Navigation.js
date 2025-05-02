import { Box, Flex, Button, HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Logo from './Logo';

const Navigation = ({ account, onDisconnect }) => {
  const router = useRouter();

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
      bg="rgba(0, 0, 0, 0.2)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      py={4}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        align="center"
        justify="space-between"
      >
        <Box cursor="pointer" onClick={() => router.push('/')}>
          <Logo size="sm" />
        </Box>

        <HStack spacing={4}>
          {account && (
            <>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => router.push('/profile')}
              >
                My Profile
              </Button>
              <Box
                bg="whiteAlpha.200"
                px={4}
                py={2}
                borderRadius="full"
                border="1px solid rgba(255, 255, 255, 0.2)"
              >
                <Text color="white" fontSize="sm">
                  {shortenAddress(account)}
                </Text>
              </Box>
              <Button
                variant="outline"
                color="white"
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigation; 