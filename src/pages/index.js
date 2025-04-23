import { Box, Container, VStack, Button, HStack } from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.lg" pt={32}>
        <VStack spacing={8} align="center" justify="center" minH="70vh">
          <Logo size="xl" />
          <HStack spacing={4} mt={8}>
            <Button
              size="lg"
              variant="solid"
              onClick={() => router.push('/dashboard')}
            >
              Explore Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/register')}
            >
              Register as Talent
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
} 