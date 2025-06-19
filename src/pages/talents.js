import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Badge,
  useColorModeValue,
  Avatar,
  HStack,
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const Talents = () => {
  const [talent, setTalent] = useState(null);
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchTalent = async () => {
      if (!window.ethereum) {
        console.log('MetaMask not installed');
        setIsLoading(false);
        return;
      }
      
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length === 0) {
          console.log('No accounts found');
          setIsLoading(false);
          return;
        }
        
        const currentAccount = accounts[0];
        console.log('Current account:', currentAccount);
        setAccount(currentAccount);
        
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ConstructionTalent.abi,
          provider
        );
        
        console.log('Contract address:', process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
        
        // Try to get talent info
        const talentInfo = await contract.getTalentInfo(currentAccount);
        console.log('Raw talent info from contract:', talentInfo);
        
        const [name, gender, birthday, physicalAddress, governmentId, career, certifications, isVerified, rating, projectCount] = talentInfo;
        
        console.log('Parsed talent info:', {
          name,
          gender,
          birthday,
          physicalAddress,
          governmentId,
          career,
          certifications,
          isVerified,
          rating: rating.toString(),
          projectCount: projectCount.toString()
        });
        
        if (name && name.length > 0) {
          setTalent({
            address: currentAccount,
            name,
            gender,
            birthday,
            physicalAddress,
            governmentId,
            career,
            certifications,
            isVerified,
            rating: Number(rating),
            projectCount: Number(projectCount),
          });
          console.log('Talent set successfully');
        } else {
          console.log('No talent found for this address');
          setTalent(null);
        }
      } catch (error) {
        console.error('Error fetching talent info:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        setTalent(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTalent();
  }, []);

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.md" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" color={textColor}>Talent Profile</Heading>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : !account ? (
            <Text>Please connect your wallet to view your talent profile.</Text>
          ) : !talent ? (
            <Text>No talent profile found for this wallet. Please register as a talent first.</Text>
          ) : (
            <Box p={8} bg={cardBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor} boxShadow="lg">
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Avatar name={talent.name} size="lg" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold">{talent.name}</Text>
                    <Badge colorScheme={talent.isVerified ? 'green' : 'yellow'}>
                      {talent.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </VStack>
                </HStack>
                <Text><b>Address:</b> {talent.address}</Text>
                <Text><b>Gender:</b> {talent.gender}</Text>
                <Text><b>Birthday:</b> {talent.birthday}</Text>
                <Text><b>Career:</b> {talent.career}</Text>
                <Text><b>Certifications:</b> {talent.certifications && talent.certifications.length > 0 ? talent.certifications.join(', ') : 'None'}</Text>
                <Text><b>Rating:</b> {talent.rating}</Text>
                <Text><b>Projects Completed:</b> {talent.projectCount}</Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Talents; 