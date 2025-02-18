import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Construction Talent Web3</title>
        <meta name="description" content="Decentralized construction talent management platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Construction Talent Web3
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Decentralized platform for managing construction industry talents
            </Text>
          </Box>

          <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
            <Heading as="h2" size="lg" mb={4}>
              Welcome to the Future of Construction Talent Management
            </Heading>
            <Text fontSize="md" mb={4}>
              Our platform leverages blockchain technology to create a transparent and efficient
              ecosystem for construction professionals and project owners.
            </Text>
            <Text fontSize="md">
              Connect your wallet to get started and explore the possibilities of Web3-powered
              talent management.
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 