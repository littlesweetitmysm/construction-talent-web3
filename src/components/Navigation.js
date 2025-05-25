import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import Logo from './Logo';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const Links = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Talents', href: '/talents' },
];

const NavLink = ({ children, href }) => {
  const router = useRouter();
  return (
    <Box
      as="button"
      px={2}
      py={1}
      rounded={'md'}
      onClick={() => router.push(href)}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      {children}
    </Box>
  );
};

export default function Navigation() {
  const [account, setAccount] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    setIsMounted(true);
    checkConnection();
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', () => window.location.reload());

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    if (account) {
      checkProfile();
    }
  }, [account]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
    setIsLoading(false);
  };

  const checkProfile = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      const talentInfo = await contract.getTalentInfo(account);
      setHasProfile(talentInfo.name !== '');
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setHasProfile(false);
    } else {
      setAccount(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  const handleProfileClick = () => {
    if (hasProfile) {
      router.push('/profile');
    } else {
      router.push('/register-talent');
    }
  };

  const disconnectWallet = async () => {
    try {
      setAccount('');
      setHasProfile(false);
      localStorage.removeItem('walletConnected');
      router.push('/').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Box 
      bg={bgColor} 
      px={4} 
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Logo size="small" />
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.name} href={link.href}>
                {link.name}
              </NavLink>
            ))}
          </HStack>
        </HStack>

        {!isLoading && (
          <>
            {!account ? (
              <IconButton
                onClick={connectWallet}
                colorScheme="blue"
                variant="solid"
                icon={<HamburgerIcon />}
                aria-label="Connect Wallet"
              />
            ) : (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HamburgerIcon />}
                  variant="outline"
                  aria-label="Options"
                />
                <MenuList>
                  <MenuItem onClick={() => window.open('https://metamask.io')}>
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleProfileClick}>
                    {hasProfile ? 'My Profile' : 'Register as Talent'}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={disconnectWallet}>
                    Disconnect
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
} 