import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Button,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';
import Logo from '../components/Logo';

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('walletConnected', 'true');
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    try {
      setAccount('');
      setIsConnected(false);
      localStorage.removeItem('walletConnected');
      
      // Note: MetaMask doesn't have a disconnect method, but we clear our connection state
      // The user would need to manually disconnect from MetaMask if they want to completely disconnect
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('walletConnected', 'true');
        } else {
          const wasConnected = localStorage.getItem('walletConnected');
          if (!wasConnected) {
            setAccount('');
            setIsConnected(false);
            localStorage.removeItem('walletConnected');
          }
        }
      }
    };
    checkConnection();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Box minH="100vh" position="relative">
      {isConnected && <Navigation account={account} onDisconnect={disconnectWallet} />}
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
            <VStack spacing={6} mt={8}>
              <Button
                size="lg"
                variant="solid"
                onClick={() => router.push('/post-project')}
                bgGradient="linear(to-r, green.400, teal.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, green.500, teal.600)",
                }}
                w="300px"
                h="60px"
                fontSize="xl"
              >
                Post Project
              </Button>
              <Button
                size="lg"
                variant="solid"
                onClick={() => router.push('/projects')}
                bgGradient="linear(to-r, orange.400, red.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, orange.500, red.600)",
                }}
                w="300px"
                h="60px"
                fontSize="xl"
              >
                Find Projects
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
} 