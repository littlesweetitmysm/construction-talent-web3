import { Box, Container, VStack, Button, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Select } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  
  const { isOpen: isTalentModalOpen, onOpen: onTalentModalOpen, onClose: onTalentModalClose } = useDisclosure();
  const { isOpen: isProjectModalOpen, onOpen: onProjectModalOpen, onClose: onProjectModalClose } = useDisclosure();

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

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
  };

  useEffect(() => {
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
            <VStack spacing={4} mt={8}>
              <Button
                size="lg"
                variant="solid"
                onClick={onTalentModalOpen}
                bgGradient="linear(to-r, green.400, teal.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, green.500, teal.600)",
                }}
                w="300px"
              >
                Register as Talent
              </Button>
              <Button
                size="lg"
                variant="solid"
                onClick={onProjectModalOpen}
                bgGradient="linear(to-r, orange.400, red.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, orange.500, red.600)",
                }}
                w="300px"
              >
                Register Project
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/projects')}
                color="white"
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.200' }}
                w="300px"
              >
                View Project List
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>

      {/* Register as Talent Modal */}
      <Modal isOpen={isTalentModalOpen} onClose={onTalentModalClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Register as Talent</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input placeholder="Enter your full name" />
              </FormControl>
              <FormControl>
                <FormLabel>Skills</FormLabel>
                <Select placeholder="Select your primary skill">
                  <option value="carpenter">Carpenter</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="mason">Mason</option>
                  <option value="painter">Painter</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Experience (years)</FormLabel>
                <Input type="number" placeholder="Years of experience" />
              </FormControl>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea placeholder="Tell us about yourself" />
              </FormControl>
              <Button colorScheme="blue" w="full">
                Register
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Register Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={onProjectModalClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Register New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Project Title</FormLabel>
                <Input placeholder="Enter project title" />
              </FormControl>
              <FormControl>
                <FormLabel>Project Type</FormLabel>
                <Select placeholder="Select project type">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="infrastructure">Infrastructure</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Budget (ETH)</FormLabel>
                <Input type="number" placeholder="Enter budget in ETH" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="Describe your project" />
              </FormControl>
              <Button colorScheme="blue" w="full">
                Create Project
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 