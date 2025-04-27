import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Badge,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const TalentProfile = ({ address, provider }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!address || !provider) return;

      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(
          contractAddress,
          ConstructionTalent.abi,
          provider
        );

        const [
          name,
          skills,
          experience,
          isVerified,
          rating,
          projectCount,
        ] = await contract.getTalentInfo(address);

        setProfile({
          name,
          skills,
          experience,
          isVerified,
          rating,
          projectCount,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch talent profile.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [address, provider]);

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="gray.500">No profile found. Please register as a talent.</Text>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Talent Profile</Heading>
        
        <Box>
          <Text fontSize="sm" color="gray.500">Name</Text>
          <Text fontSize="md" fontWeight="medium">{profile.name}</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">Skills</Text>
          <Text fontSize="md" fontWeight="medium">{profile.skills}</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">Experience</Text>
          <Text fontSize="md" fontWeight="medium">{profile.experience} years</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">Status</Text>
          <Badge colorScheme={profile.isVerified ? 'green' : 'yellow'}>
            {profile.isVerified ? 'Verified' : 'Pending Verification'}
          </Badge>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">Rating</Text>
          <Text fontSize="md" fontWeight="medium">{profile.rating}/5</Text>
        </Box>

        <Box>
          <Text fontSize="sm" color="gray.500">Projects Completed</Text>
          <Text fontSize="md" fontWeight="medium">{profile.projectCount}</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default TalentProfile; 