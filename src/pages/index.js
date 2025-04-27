import { Box, Container, VStack, Button, HStack, useDisclosure } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <Box minH="100vh" position="relative">
      {isConnected && <Navigation account={account} />}
      <Container maxW="container.lg" pt={isConnected ? 32 : 0}>
        <VStack spacing={8} align="center" justify="center" minH="100vh">
          <Logo size="xl" />
          {!isConnected ? (
            <Button
              size="lg"
              variant="solid"
              onClick={connectWallet}
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, blue.500, purple.600)",
              }}
              px={8}
              py={6}
              fontSize="xl"
            >
              Connect Wallet
            </Button>
          ) : (
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
          )}
        </VStack>
      </Container>
    </Box>
  );
} 