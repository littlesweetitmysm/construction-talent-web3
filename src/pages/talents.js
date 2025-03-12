import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Button,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  useToast,
  Avatar,
  Progress,
} from '@chakra-ui/react';
import { getTalentInfo } from '../utils/contract';
import TalentRegistration from '../components/TalentRegistration';
import Navigation from '../components/Navigation';

const Talents = ({ provider, signer }) => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const loadTalents = async () => {
      try {
        // In a real application, you would fetch the list of registered talents
        // For this example, we'll use some sample addresses
        const sampleAddresses = [
          '0x1234567890123456789012345678901234567890',
          '0x2345678901234567890123456789012345678901',
          '0x3456789012345678901234567890123456789012',
        ];

        const talentPromises = sampleAddresses.map(address =>
          getTalentInfo(provider, address)
        );
        const talentResults = await Promise.all(talentPromises);
        setTalents(talentResults.filter(talent => talent.name)); // Filter out empty profiles
      } catch (error) {
        console.error('Error loading talents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load talents',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (provider) {
      loadTalents();
    }
  }, [provider]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading as="h1" size="xl">
              Available Talents
            </Heading>
            <Button colorScheme="blue" onClick={onOpen}>
              Register as Talent
            </Button>
          </HStack>

          {loading ? (
            <Text>Loading talents...</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {talents.map((talent, index) => (
                <Box
                  key={index}
                  p={6}
                  borderWidth={1}
                  borderRadius="lg"
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
                >
                  <VStack align="stretch" spacing={4}>
                    <HStack spacing={4}>
                      <Avatar
                        name={talent.name}
                        size="lg"
                        bg="blue.500"
                        color="white"
                      >
                        {getInitials(talent.name)}
                      </Avatar>
                      <VStack align="start" spacing={1}>
                        <Heading as="h3" size="md">
                          {talent.name}
                        </Heading>
                        <Badge colorScheme={talent.isVerified ? 'green' : 'yellow'}>
                          {talent.isVerified ? 'Verified' : 'Pending Verification'}
                        </Badge>
                      </VStack>
                    </HStack>

                    <Text color="gray.600">{talent.skills}</Text>

                    <VStack align="stretch" spacing={2}>
                      <Text fontSize="sm" color="gray.500">
                        Experience: {talent.experience} years
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Projects Completed: {talent.projectCount}
                      </Text>
                      <Box>
                        <Text fontSize="sm" mb={1}>
                          Rating: {talent.rating}/5
                        </Text>
                        <Progress
                          value={talent.rating * 20}
                          size="sm"
                          colorScheme="blue"
                          borderRadius="full"
                        />
                      </Box>
                    </VStack>

                    <Button colorScheme="blue" size="sm">
                      View Profile
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      <TalentRegistration
        isOpen={isOpen}
        onClose={onClose}
        signer={signer}
      />
    </>
  );
};

export default Talents; 