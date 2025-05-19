import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Avatar,
  Badge,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { getTalentInfo } from '../utils/contract';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [account, setAccount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const { address } = router.query;

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    physicalAddress: '',
    governmentId: '',
    career: '',
  });

  useEffect(() => {
    checkConnection();
    if (address) {
      fetchProfile();
    }
  }, [address]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsOwner(accounts[0].toLowerCase() === address?.toLowerCase());
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      const talentInfo = await contract.getTalentInfo(address);
      
      if (talentInfo.name === '') {
        router.push('/404');
        return;
      }

      setProfile({
        name: talentInfo.name,
        gender: talentInfo.gender,
        birthday: new Date(talentInfo.birthday * 1000).toISOString().split('T')[0],
        physicalAddress: talentInfo.physicalAddress,
        governmentId: talentInfo.governmentId,
        career: talentInfo.career,
        isVerified: talentInfo.isVerified,
        rating: talentInfo.rating.toNumber(),
        completedProjects: talentInfo.completedProjects.toNumber(),
        lastUpdateTimestamp: new Date(talentInfo.lastUpdateTimestamp * 1000),
      });

      setFormData({
        name: talentInfo.name,
        gender: talentInfo.gender,
        birthday: new Date(talentInfo.birthday * 1000).toISOString().split('T')[0],
        physicalAddress: talentInfo.physicalAddress,
        governmentId: talentInfo.governmentId,
        career: talentInfo.career,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch profile information',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        signer
      );

      const birthdayTimestamp = Math.floor(new Date(formData.birthday).getTime() / 1000);

      const tx = await contract.updateTalentProfile(
        formData.name,
        formData.gender,
        birthdayTimestamp,
        formData.physicalAddress,
        formData.governmentId,
        formData.career
      );

      await tx.wait();

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navigation />
        <Container maxW="container.md" py={10}>
          <Text>Loading...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navigation />
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="xl"
          >
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Heading size="xl">{profile.name}</Heading>
                {isOwner && (
                  <Button colorScheme="blue" onClick={onOpen}>
                    Edit Profile
                  </Button>
                )}
              </HStack>

              <HStack>
                <Badge colorScheme={profile.isVerified ? 'green' : 'yellow'}>
                  {profile.isVerified ? 'Verified' : 'Pending Verification'}
                </Badge>
                <Badge colorScheme="blue">
                  Rating: {profile.rating}/5
                </Badge>
                <Badge colorScheme="purple">
                  {profile.completedProjects} Projects Completed
                </Badge>
              </HStack>

              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Gender</Text>
                  <Text>{profile.gender}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Birthday</Text>
                  <Text>{profile.birthday}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Physical Address</Text>
                  <Text>{profile.physicalAddress}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Government ID</Text>
                  <Text>{profile.governmentId}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Career</Text>
                  <Text>{profile.career}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Last Updated</Text>
                  <Text>{profile.lastUpdateTimestamp.toLocaleString()}</Text>
                </Box>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Birthday</FormLabel>
                <Input
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Physical Address</FormLabel>
                <Textarea
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Government ID</FormLabel>
                <Input
                  name="governmentId"
                  value={formData.governmentId}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Career</FormLabel>
                <Textarea
                  name="career"
                  value={formData.career}
                  onChange={handleInputChange}
                />
              </FormControl>

              <Button colorScheme="blue" onClick={handleUpdateProfile} width="full">
                Update Profile
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile; 