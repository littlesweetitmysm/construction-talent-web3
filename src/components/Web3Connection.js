import { useState, useEffect } from 'react';
import { Button, Text, VStack, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const Web3Connection = () => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
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

      setAccount(address);
      setProvider(provider);

      connection.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });

      connection.on('chainChanged', () => {
        window.location.reload();
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

  return (
    <VStack spacing={4}>
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
        <Text fontSize="md" color="gray.600">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </Text>
      )}
    </VStack>
  );
};

export default Web3Connection; 