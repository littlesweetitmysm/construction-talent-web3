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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  Stack,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const Talents = () => {
  const [talents, setTalents] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [careerFilter, setCareerFilter] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Career options for filtering
  const careerOptions = [
    'Architect',
    'Civil Engineer',
    'Structural Engineer',
    'Electrical Engineer',
    'Mechanical Engineer',
    'Plumbing Engineer',
    'HVAC Engineer',
    'Construction Manager',
    'Project Manager',
    'Site Supervisor',
    'Foreman',
    'Carpenter',
    'Electrician',
    'Plumber',
    'HVAC Technician',
    'Mason',
    'Welder',
    'Heavy Equipment Operator',
    'Surveyor',
    'Safety Officer',
    'Quality Control Inspector',
    'Cost Estimator',
    'Interior Designer',
    'Landscape Architect',
    'Other'
  ];

  useEffect(() => {
    fetchAllTalents();
  }, []);

  useEffect(() => {
    filterTalents();
  }, [talents, searchTerm, careerFilter]);

  const fetchAllTalents = async () => {
    if (!window.ethereum) {
      setIsLoading(false);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      // Get all talent addresses (this would need to be implemented in the contract)
      // For now, we'll use a different approach - get recent talents
      const allTalents = [];
      
      // Try to get talents from events or a different method
      // Since we don't have a direct method to get all talents, we'll use a different approach
      // We'll check for talents in a range of addresses or use events
      
      // For demonstration, let's try to get talents from recent events
      try {
        // Get talent registration events
        const filter = contract.filters.TalentRegistered();
        const events = await contract.queryFilter(filter, 0, 'latest');
        
        for (const event of events) {
          try {
            const talentAddress = event.args.talentAddress;
            const talentInfo = await contract.getTalentInfo(talentAddress);
            const [name, gender, birthday, physicalAddress, governmentId, career, certifications, isVerified, rating, projectCount] = talentInfo;
            
            if (name && name.length > 0) {
              allTalents.push({
                address: talentAddress,
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
            }
          } catch (error) {
            console.error('Error fetching talent info for address:', event.args.talentAddress, error);
          }
        }
      } catch (error) {
        console.error('Error fetching talent events:', error);
      }

      // If no talents found from events, try a different approach
      if (allTalents.length === 0) {
        // For now, let's create some mock data to demonstrate the functionality
        // In a real implementation, you would need to add a method to the contract to get all talents
        console.log('No talents found from events, using mock data for demonstration');
        setTalents([
          {
            address: '0x1234567890123456789012345678901234567890',
            name: 'John Smith',
            gender: 'Male',
            birthday: '1985-03-15',
            physicalAddress: '123 Main St, City, State',
            governmentId: 'ID123456',
            career: 'Civil Engineer',
            certifications: ['PE License', 'OSHA Safety'],
            isVerified: true,
            rating: 4.5,
            projectCount: 12,
          },
          {
            address: '0x2345678901234567890123456789012345678901',
            name: 'Sarah Johnson',
            gender: 'Female',
            birthday: '1990-07-22',
            physicalAddress: '456 Oak Ave, City, State',
            governmentId: 'ID789012',
            career: 'Architect',
            certifications: ['AIA License', 'LEED AP'],
            isVerified: true,
            rating: 4.8,
            projectCount: 8,
          },
          {
            address: '0x3456789012345678901234567890123456789012',
            name: 'Mike Wilson',
            gender: 'Male',
            birthday: '1988-11-08',
            physicalAddress: '789 Pine Rd, City, State',
            governmentId: 'ID345678',
            career: 'Construction Manager',
            certifications: ['PMP', 'Safety Manager'],
            isVerified: false,
            rating: 4.2,
            projectCount: 15,
          },
        ]);
      } else {
        setTalents(allTalents);
      }
    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTalents = () => {
    let filtered = talents;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.career.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.certifications.some(cert => cert.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by career
    if (careerFilter) {
      filtered = filtered.filter(talent => talent.career === careerFilter);
    }

    setFilteredTalents(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCareerFilterChange = (e) => {
    setCareerFilter(e.target.value);
  };

  if (isLoading) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.xl" pt={20} pb={10}>
          <VStack spacing={8} align="center">
            <Spinner size="xl" />
            <Text>Loading talents...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="xl" color={textColor} mb={2}>
              Construction Talents
            </Heading>
            <Text color="gray.500">
              Discover skilled professionals in the construction industry
            </Text>
          </Box>

          {/* Search and Filter */}
          <HStack spacing={4} wrap="wrap">
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search by name, career, or certifications..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputGroup>
            <Select
              placeholder="Filter by career"
              value={careerFilter}
              onChange={handleCareerFilterChange}
              maxW="200px"
            >
              {careerOptions.map((career) => (
                <option key={career} value={career}>
                  {career}
                </option>
              ))}
            </Select>
          </HStack>

          {/* Results Count */}
          <Text color="gray.500">
            {filteredTalents.length} talent{filteredTalents.length !== 1 ? 's' : ''} found
          </Text>

          {/* Talents Grid */}
          {filteredTalents.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredTalents.map((talent, index) => (
                <Card key={index} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {/* Header */}
                      <HStack spacing={4}>
                        <Avatar name={talent.name} size="lg" />
                        <VStack align="start" spacing={1} flex={1}>
                          <Heading size="md">{talent.name}</Heading>
                          <HStack>
                            <Badge colorScheme={talent.isVerified ? 'green' : 'yellow'} size="sm">
                              {talent.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                            <Badge colorScheme="blue" size="sm">
                              {talent.career}
                            </Badge>
                          </HStack>
                        </VStack>
                      </HStack>

                      <Divider />

                      {/* Stats */}
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.500">Rating</Text>
                          <Text fontWeight="bold">{talent.rating}/5</Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.500">Projects</Text>
                          <Text fontWeight="bold">{talent.projectCount}</Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.500">Location</Text>
                          <Text fontSize="sm" noOfLines={1}>
                            {talent.physicalAddress.split(',')[0]}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Certifications */}
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>
                          Certifications
                        </Text>
                        <HStack flexWrap="wrap" spacing={1}>
                          {talent.certifications && talent.certifications.length > 0 ? (
                            talent.certifications.slice(0, 3).map((cert, certIndex) => (
                              <Badge key={certIndex} colorScheme="green" size="xs">
                                {cert}
                              </Badge>
                            ))
                          ) : (
                            <Text fontSize="sm" color="gray.500">No certifications</Text>
                          )}
                          {talent.certifications && talent.certifications.length > 3 && (
                            <Badge colorScheme="gray" size="xs">
                              +{talent.certifications.length - 3} more
                            </Badge>
                          )}
                        </HStack>
                      </Box>

                      {/* Contact Info */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontFamily="mono">
                          {talent.address.slice(0, 6)}...{talent.address.slice(-4)}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Alert status="info">
              <AlertIcon />
              No talents found matching your search criteria.
            </Alert>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Talents; 