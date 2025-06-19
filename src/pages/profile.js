import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  useColorModeValue,
  Avatar,
  Button,
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
  useToast,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const Profile = () => {
  const [talent, setTalent] = useState(null);
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [updateForm, setUpdateForm] = useState({
    additionalSkills: '',
    additionalCertifications: '',
    experience: '',
    portfolio: '',
    references: '',
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchTalentProfile();
  }, []);

  const fetchTalentProfile = async () => {
    if (!window.ethereum) {
      setIsLoading(false);
      return;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const currentAccount = accounts[0];
      setAccount(currentAccount);
      
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );
      
      const talentInfo = await contract.getTalentInfo(currentAccount);
      const [name, gender, birthday, physicalAddress, governmentId, career, certifications, isVerified, rating, projectCount] = talentInfo;
      
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
          // Additional fields (stored in localStorage for now)
          additionalSkills: localStorage.getItem(`talent_${currentAccount}_skills`) || '',
          additionalCertifications: localStorage.getItem(`talent_${currentAccount}_additionalCerts`) || '',
          experience: localStorage.getItem(`talent_${currentAccount}_experience`) || '',
          portfolio: localStorage.getItem(`talent_${currentAccount}_portfolio`) || '',
          references: localStorage.getItem(`talent_${currentAccount}_references`) || '',
        });
      }
    } catch (error) {
      console.error('Error fetching talent profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    if (!talent) return;

    setIsUpdating(true);
    try {
      // Update local storage with new content (appending to existing)
      const currentSkills = talent.additionalSkills || '';
      const currentCerts = talent.additionalCertifications || '';
      const currentExp = talent.experience || '';
      const currentPortfolio = talent.portfolio || '';
      const currentRefs = talent.references || '';

      const newSkills = currentSkills + (updateForm.additionalSkills ? '\n' + updateForm.additionalSkills : '');
      const newCerts = currentCerts + (updateForm.additionalCertifications ? '\n' + updateForm.additionalCertifications : '');
      const newExp = currentExp + (updateForm.experience ? '\n' + updateForm.experience : '');
      const newPortfolio = currentPortfolio + (updateForm.portfolio ? '\n' + updateForm.portfolio : '');
      const newRefs = currentRefs + (updateForm.references ? '\n' + updateForm.references : '');

      localStorage.setItem(`talent_${account}_skills`, newSkills);
      localStorage.setItem(`talent_${account}_additionalCerts`, newCerts);
      localStorage.setItem(`talent_${account}_experience`, newExp);
      localStorage.setItem(`talent_${account}_portfolio`, newPortfolio);
      localStorage.setItem(`talent_${account}_references`, newRefs);

      // Update state
      setTalent(prev => ({
        ...prev,
        additionalSkills: newSkills,
        additionalCertifications: newCerts,
        experience: newExp,
        portfolio: newPortfolio,
        references: newRefs,
      }));

      // Reset form
      setUpdateForm({
        additionalSkills: '',
        additionalCertifications: '',
        experience: '',
        portfolio: '',
        references: '',
      });

      onClose();
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.md" pt={20} pb={10}>
          <VStack spacing={8} align="center">
            <Spinner size="xl" />
            <Text>Loading profile...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!account) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.md" pt={20} pb={10}>
          <Alert status="warning">
            <AlertIcon />
            Please connect your wallet to view your profile.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!talent) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.md" pt={20} pb={10}>
          <VStack spacing={6}>
            <Alert status="info">
              <AlertIcon />
              No talent profile found for this wallet.
            </Alert>
            <Button colorScheme="blue" onClick={() => window.location.href = '/register-talent'}>
              Register as Talent
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.lg" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Heading size="xl" color={textColor}>My Profile</Heading>
            <Button
              leftIcon={<EditIcon />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Update Profile
            </Button>
          </HStack>

          {/* Main Profile Card */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Basic Info */}
                <HStack spacing={6}>
                  <Avatar name={talent.name} size="2xl" />
                  <VStack align="start" spacing={2}>
                    <Heading size="lg">{talent.name}</Heading>
                    <HStack>
                      <Badge colorScheme={talent.isVerified ? 'green' : 'yellow'} size="lg">
                        {talent.isVerified ? 'Verified Professional' : 'Pending Verification'}
                      </Badge>
                      <Badge colorScheme="blue" size="lg">
                        {talent.career}
                      </Badge>
                    </HStack>
                    <Text color="gray.500">Wallet: {talent.address}</Text>
                  </VStack>
                </HStack>

                <Divider />

                {/* Personal Information */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>Personal Information</Text>
                    <VStack align="start" spacing={1}>
                      <Text><b>Gender:</b> {talent.gender}</Text>
                      <Text><b>Birthday:</b> {talent.birthday}</Text>
                      <Text><b>Address:</b> {talent.physicalAddress}</Text>
                      <Text><b>Government ID:</b> {talent.governmentId}</Text>
                    </VStack>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={2}>Professional Stats</Text>
                    <VStack align="start" spacing={1}>
                      <Text><b>Rating:</b> {talent.rating}/5</Text>
                      <Text><b>Projects Completed:</b> {talent.projectCount}</Text>
                      <Text><b>Career:</b> {talent.career}</Text>
                    </VStack>
                  </Box>
                </SimpleGrid>

                <Divider />

                {/* Certifications */}
                <Box>
                  <Text fontWeight="bold" mb={3}>Certifications</Text>
                  <HStack flexWrap="wrap" spacing={2}>
                    {talent.certifications && talent.certifications.length > 0 ? (
                      talent.certifications.map((cert, index) => (
                        <Badge key={index} colorScheme="green" size="md">
                          {cert}
                        </Badge>
                      ))
                    ) : (
                      <Text color="gray.500">No certifications listed</Text>
                    )}
                  </HStack>
                  {talent.additionalCertifications && (
                    <Box mt={3}>
                      <Text fontWeight="semibold" mb={2}>Additional Certifications:</Text>
                      <Text whiteSpace="pre-line">{talent.additionalCertifications}</Text>
                    </Box>
                  )}
                </Box>

                <Divider />

                {/* Additional Skills */}
                {talent.additionalSkills && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Additional Skills</Text>
                    <Text whiteSpace="pre-line">{talent.additionalSkills}</Text>
                  </Box>
                )}

                {/* Experience */}
                {talent.experience && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Experience</Text>
                    <Text whiteSpace="pre-line">{talent.experience}</Text>
                  </Box>
                )}

                {/* Portfolio */}
                {talent.portfolio && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Portfolio</Text>
                    <Text whiteSpace="pre-line">{talent.portfolio}</Text>
                  </Box>
                )}

                {/* References */}
                {talent.references && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>References</Text>
                    <Text whiteSpace="pre-line">{talent.references}</Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Update Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Additional Skills</FormLabel>
                <Textarea
                  name="additionalSkills"
                  value={updateForm.additionalSkills}
                  onChange={handleUpdateFormChange}
                  placeholder="Add new skills..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Additional Certifications</FormLabel>
                <Textarea
                  name="additionalCertifications"
                  value={updateForm.additionalCertifications}
                  onChange={handleUpdateFormChange}
                  placeholder="Add new certifications..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Experience</FormLabel>
                <Textarea
                  name="experience"
                  value={updateForm.experience}
                  onChange={handleUpdateFormChange}
                  placeholder="Add work experience..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Portfolio</FormLabel>
                <Textarea
                  name="portfolio"
                  value={updateForm.portfolio}
                  onChange={handleUpdateFormChange}
                  placeholder="Add portfolio items..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>References</FormLabel>
                <Textarea
                  name="references"
                  value={updateForm.references}
                  onChange={handleUpdateFormChange}
                  placeholder="Add references..."
                />
              </FormControl>

              <HStack spacing={3} w="full">
                <Button
                  colorScheme="blue"
                  onClick={handleUpdateProfile}
                  isLoading={isUpdating}
                  flex={1}
                >
                  Update Profile
                </Button>
                <Button onClick={onClose} flex={1}>
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile; 