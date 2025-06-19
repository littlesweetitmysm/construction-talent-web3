import { useState, useEffect } from 'react';
import { Button, Text, VStack, HStack, Box, Heading, useToast, Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import TalentProfile from './TalentProfile';
import TalentRegistration from './TalentRegistration';
import ProjectManagement from './ProjectManagement';

const Web3Connection = () => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      setAccount(address);
      setProvider(provider);
      setNetwork(network);
      setBalance(ethers.utils.formatEther(balance));

      connection.on('accountsChanged', async (accounts) => {
        setAccount(accounts[0]);
        const newBalance = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(newBalance));
      });

      connection.on('chainChanged', async () => {
        const newNetwork = await provider.getNetwork();
        setNetwork(newNetwork);
        const newBalance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(newBalance));
      });

      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been successfully connected.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect wallet. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear state
      setAccount('');
      setProvider(null);
      setBalance('0');
      setNetwork(null);
      setShowProfile(false);
      
      // Remove local storage
      localStorage.removeItem('walletConnected');
      
      // Clear Web3Modal cache
      if (window.web3Modal) {
        window.web3Modal.clearCachedProvider();
      }
      
      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: 'Disconnect Error',
        description: 'Error disconnecting wallet.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleRegistrationSuccess = () => {
    onClose();
    setShowProfile(true);
  };

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {!account ? (
        <Button
          colorScheme="blue"
          size="lg"
          onClick={connectWallet}
          _hover={{ transform: 'scale(1.05)' }}
          transition="all 0.2s"
        >
          Connect Wallet
        </Button>
      ) : (
        <>
          <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="sm">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Wallet Profile</Heading>
                <Button size="sm" colorScheme="red" variant="ghost" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </HStack>
              
              <Box>
                <Text fontSize="sm" color="gray.500">Connected Address</Text>
                <Text fontSize="md" fontWeight="medium">{account}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">Network</Text>
                <HStack>
                  <Text fontSize="md" fontWeight="medium">
                    {network?.name || 'Unknown Network'}
                  </Text>
                  <Badge colorScheme={network?.chainId === 1337 ? 'green' : 'yellow'}>
                    Chain ID: {network?.chainId}
                  </Badge>
                </HStack>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">Balance</Text>
                <Text fontSize="md" fontWeight="medium">
                  {parseFloat(balance).toFixed(4)} ETH
                </Text>
              </Box>

              <HStack spacing={4} pt={2}>
                <Button colorScheme="blue" size="sm" flex={1} onClick={handleViewProfile}>
                  View Profile
                </Button>
                <Button colorScheme="green" size="sm" flex={1} onClick={onOpen}>
                  Register Talent
                </Button>
              </HStack>
            </VStack>
          </Box>

          {showProfile && (
            <TalentProfile address={account} provider={provider} />
          )}

          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Projects</Tab>
              <Tab>My Profile</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ProjectManagement provider={provider} address={account} />
              </TabPanel>
              <TabPanel>
                {showProfile ? (
                  <TalentProfile address={account} provider={provider} />
                ) : (
                  <Box textAlign="center" py={4}>
                    <Text color="gray.500">Please register as a talent to view your profile.</Text>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register as Talent</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <TalentRegistration provider={provider} onSuccess={handleRegistrationSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Web3Connection; 