import { Box, Container, VStack, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Textarea, Select } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  
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
            <VStack spacing={6} mt={8}>
              <Button
                size="lg"
                variant="solid"
                onClick={onProjectModalOpen}
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

      {/* Register Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={onProjectModalClose} size="4xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="gray.800" color="white" minH="70vh">
          <ModalHeader fontSize="2xl" pb={6}>Post New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel fontSize="lg">Project Title</FormLabel>
                <Input 
                  placeholder="Enter project title" 
                  size="lg"
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="lg">Project Type</FormLabel>
                <Select 
                  placeholder="Select project type"
                  size="lg"
                  _placeholder={{ color: 'gray.400' }}
                >
                  <option value="residential">Residential Construction</option>
                  <option value="commercial">Commercial Building</option>
                  <option value="industrial">Industrial Facility</option>
                  <option value="infrastructure">Infrastructure Development</option>
                  <option value="renovation">Renovation</option>
                  <option value="specialty">Specialty Construction</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="lg">Required Skills</FormLabel>
                <Select 
                  placeholder="Select required skills"
                  size="lg"
                  multiple
                  _placeholder={{ color: 'gray.400' }}
                >
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="masonry">Masonry</option>
                  <option value="hvac">HVAC</option>
                  <option value="painting">Painting</option>
                  <option value="roofing">Roofing</option>
                  <option value="general">General Construction</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="lg">Budget (ETH)</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Enter budget in ETH"
                  size="lg"
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="lg">Project Timeline</FormLabel>
                <Input 
                  type="date"
                  size="lg"
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="lg">Description</FormLabel>
                <Textarea 
                  placeholder="Describe your project in detail..."
                  size="lg"
                  minH="200px"
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>

              <Button 
                colorScheme="blue" 
                w="full"
                size="lg"
                height="60px"
                fontSize="lg"
                mt={4}
              >
                Post Project
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 