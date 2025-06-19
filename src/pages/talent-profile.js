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
  useToast,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';
import { useRouter } from 'next/router';
import { getTalentByAddress } from '../utils/contract';

const TalentProfile = () => {
  const [talent, setTalent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const router = useRouter();
  const { address } = router.query;

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (address) {
      fetchTalentProfile();
    }
  }, [address]);

  const fetchTalentProfile = async () => {
    if (!address || !window.ethereum) {
      setIsLoading(false);
      setError('Invalid address or no wallet connected');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      const talentData = await getTalentByAddress(contract, address);
      
      if (talentData) {
        setTalent(talentData);
      } else {
        setError('No talent profile found for this address');
      }
    } catch (error) {
      console.error('Error fetching talent profile:', error);
      setError('Failed to fetch talent profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.md" pt={20} pb={10}>
          <VStack spacing={8} align="center">
            <Spinner size="xl" />
            <Text>Loading talent profile...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.md" pt={20} pb={10}>
          <VStack spacing={6}>
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
            <Button leftIcon={<ArrowBackIcon />} onClick={() => router.push('/talents')}>
              Back to Talents
            </Button>
          </VStack>
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
              No talent profile found for this address.
            </Alert>
            <Button leftIcon={<ArrowBackIcon />} onClick={() => router.push('/talents')}>
              Back to Talents
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
            <Heading size="xl" color={textColor}>Talent Profile</Heading>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="outline"
              onClick={() => router.push('/talents')}
            >
              Back to Talents
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
    </Box>
  );
};

export default TalentProfile; 