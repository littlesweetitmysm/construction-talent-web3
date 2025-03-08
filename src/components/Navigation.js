import { Box, Flex, Button, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = ({ account }) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const isActive = (path) => router.pathname === path;

  return (
    <Box
      as="nav"
      position="fixed"
      w="100%"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={1000}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        h={16}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <Link href="/" passHref>
            <Text
              fontSize="xl"
              fontWeight="bold"
              cursor="pointer"
              _hover={{ color: 'blue.500' }}
            >
              Construction Talent Web3
            </Text>
          </Link>
        </Flex>

        <Flex alignItems="center" gap={4}>
          <Link href="/projects" passHref>
            <Button
              variant="ghost"
              colorScheme={isActive('/projects') ? 'blue' : 'gray'}
              fontWeight={isActive('/projects') ? 'bold' : 'normal'}
            >
              Projects
            </Button>
          </Link>

          <Link href="/talents" passHref>
            <Button
              variant="ghost"
              colorScheme={isActive('/talents') ? 'blue' : 'gray'}
              fontWeight={isActive('/talents') ? 'bold' : 'normal'}
            >
              Talents
            </Button>
          </Link>

          {account && (
            <Link href="/dashboard" passHref>
              <Button
                variant="ghost"
                colorScheme={isActive('/dashboard') ? 'blue' : 'gray'}
                fontWeight={isActive('/dashboard') ? 'bold' : 'normal'}
              >
                Dashboard
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation; 