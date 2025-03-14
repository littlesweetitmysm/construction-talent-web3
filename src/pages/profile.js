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
} from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import { getTalentInfo } from '../utils/contract';

const Profile = ({ provider, signer, account }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: '',
    certifications: '',
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      if (!provider || !account) return;

      try {
        const talentInfo = await getTalentInfo(provider, account);
        if (talentInfo) {
          setProfile(talentInfo);
          setFormData({
            name: talentInfo.name,
            skills: talentInfo.skills,
            experience: talentInfo.experience.toString(),
            certifications: talentInfo.certifications,
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [provider, account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real application, you would update the profile on the blockchain
    toast({
      title: 'Success',
      description: 'Profile updated successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <>
        <Navigation account={account} />
        <Container maxW="container.xl" pt={20} pb={10}>
          <Text>Loading profile...</Text>
        </Container>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navigation account={account} />
        <Container maxW="container.xl" pt={20} pb={10}>
          <VStack spacing={4}>
            <Heading as="h1" size="xl">
              Profile Not Found
            </Heading>
            <Text>You need to register as a talent first.</Text>
            <Button
              colorScheme="blue"
              onClick={() => window.location.href = '/talents'}
            >
              Register as Talent
            </Button>
          </VStack>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation account={account} />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading as="h1" size="xl">
              Profile
            </Heading>
            <Button
              colorScheme="blue"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </HStack>

          {isEditing ? (
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Skills</FormLabel>
                  <Textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Enter your skills (comma-separated)"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Years of Experience</FormLabel>
                  <Input
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    min="0"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Certifications</FormLabel>
                  <Textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="Enter your certifications (comma-separated)"
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  Save Changes
                </Button>
              </VStack>
            </Box>
          ) : (
            <>
              <HStack spacing={8} align="start">
                <Avatar
                  size="2xl"
                  name={profile.name}
                  bg="blue.500"
                  color="white"
                />
                <VStack align="start" spacing={4}>
                  <Heading as="h2" size="lg">
                    {profile.name}
                  </Heading>
                  <Badge colorScheme={profile.isVerified ? 'green' : 'yellow'}>
                    {profile.isVerified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                  <Text color="gray.600">{profile.skills}</Text>
                </VStack>
              </HStack>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Stat>
                  <StatLabel>Experience</StatLabel>
                  <StatNumber>{profile.experience} years</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    1 year
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Projects Completed</StatLabel>
                  <StatNumber>{profile.projectCount}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    2 projects
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Rating</StatLabel>
                  <StatNumber>{profile.rating}/5</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    0.5 points
                  </StatHelpText>
                </Stat>
              </SimpleGrid>

              <Box>
                <Heading as="h3" size="md" mb={4}>
                  Certifications
                </Heading>
                <Text color="gray.600">{profile.certifications}</Text>
              </Box>
            </>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default Profile; 