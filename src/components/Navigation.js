import { Box, Flex, Button, Image, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.2)"
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
          <Image src="/logo.png" alt="Construction Talent Web3" h="40px" />
        </Box>

        <HStack spacing={4}>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant="solid"
            onClick={() => router.push('/connect')}
          >
            Connect Wallet
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navigation; 