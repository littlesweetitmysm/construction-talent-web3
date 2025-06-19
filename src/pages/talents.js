import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Input,
  Select,
  HStack,
  VStack,
  Text,
  Badge,
  InputGroup,
  InputLeftElement,
  Card,
  CardBody,
  Stack,
  Divider,
  Button,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react';
import { SearchIcon, StarIcon, CheckCircleIcon } from '@chakra-ui/icons';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';
import { useRouter } from 'next/router';

const Talents = () => {
  const [talents, setTalents] = useState([]);
  const [filteredTalents, setFilteredTalents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    career: '',
    verification: '',
    rating: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const router = useRouter();

  useEffect(() => {
    fetchTalents();
  }, []);

  useEffect(() => {
    filterTalents();
  }, [searchTerm, filters, talents]);

  const fetchTalents = async () => {
    try {
      if (!window.ethereum) {
        setIsLoading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      // Get all registered talents by checking events or using a different approach
      // Since the contract doesn't have a talentCount, we'll use a different strategy
      
      // Option 1: Check for talent registration events
      // Option 2: Use a list of known addresses (for demo purposes)
      // Option 3: Add a talentCount to the contract (recommended for production)
      
      // For now, let's use a combination of known addresses and event checking
      const knownAddresses = [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
      ];

      const talentsArray = [];

      // Check each known address for talent registration
      for (const address of knownAddresses) {
        try {
          const talentInfo = await contract.getTalentInfo(address);
          const [name, gender, birthday, physicalAddress, governmentId, career, certifications, isVerified, rating, projectCount] = talentInfo;
          
          // Only include if the talent is actually registered (has a name)
          if (name && name.length > 0) {
            talentsArray.push({
              address,
              name,
              gender,
              birthday,
              physicalAddress,
              governmentId,
              career,
              certifications: certifications || [],
              isVerified,
              rating: Number(rating),
              projectCount: Number(projectCount),
              // Additional fields from localStorage (if any)
              additionalSkills: localStorage.getItem(`talent_${address}_skills`) || '',
              additionalCertifications: localStorage.getItem(`talent_${address}_additionalCerts`) || '',
              experience: localStorage.getItem(`talent_${address}_experience`) || '',
              portfolio: localStorage.getItem(`talent_${address}_portfolio`) || '',
              references: localStorage.getItem(`talent_${address}_references`) || '',
            });
          }
        } catch (error) {
          // Skip addresses that don't have talent info
          console.log(`No talent info for address: ${address}`);
        }
      }

      // Also check the current user's address if connected
      try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const currentAddress = accounts[0];
          if (!knownAddresses.includes(currentAddress)) {
            const talentInfo = await contract.getTalentInfo(currentAddress);
            const [name, gender, birthday, physicalAddress, governmentId, career, certifications, isVerified, rating, projectCount] = talentInfo;
            
            if (name && name.length > 0) {
              talentsArray.push({
                address: currentAddress,
                name,
                gender,
                birthday,
                physicalAddress,
                governmentId,
                career,
                certifications: certifications || [],
                isVerified,
                rating: Number(rating),
                projectCount: Number(projectCount),
                additionalSkills: localStorage.getItem(`talent_${currentAddress}_skills`) || '',
                additionalCertifications: localStorage.getItem(`talent_${currentAddress}_additionalCerts`) || '',
                experience: localStorage.getItem(`talent_${currentAddress}_experience`) || '',
                portfolio: localStorage.getItem(`talent_${currentAddress}_portfolio`) || '',
                references: localStorage.getItem(`talent_${currentAddress}_references`) || '',
              });
            }
          }
        }
      } catch (error) {
        console.log('Error checking current user talent info:', error);
      }

      setTalents(talentsArray);
      setFilteredTalents(talentsArray);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching talents:', error);
      setIsLoading(false);
    }
  };

  const filterTalents = () => {
    let filtered = [...talents];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(talent =>
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.career.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.certifications.some(cert => 
          cert.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Career filter
    if (filters.career) {
      filtered = filtered.filter(talent => talent.career === filters.career);
    }

    // Verification filter
    if (filters.verification) {
      const isVerified = filters.verification === 'verified';
      filtered = filtered.filter(talent => talent.isVerified === isVerified);
    }

    // Rating filter
    if (filters.rating) {
      const [min, max] = filters.rating.split('-').map(Number);
      filtered = filtered.filter(talent => {
        const rating = talent.rating;
        return rating >= min && rating <= max;
      });
    }

    setFilteredTalents(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewTalent = (talent) => {
    router.push(`/talent-profile?address=${talent.address}`);
  };

  const getCareerColor = (career) => {
    const colors = {
      'Carpenter': 'orange',
      'Electrician': 'yellow',
      'Plumber': 'blue',
      'Mason': 'gray',
      'Welder': 'red',
      'Painter': 'purple',
      'HVAC Technician': 'cyan',
      'Roofing Specialist': 'brown',
      'Flooring Installer': 'teal',
      'Concrete Worker': 'slate',
      'Heavy Equipment Operator': 'green',
      'Safety Inspector': 'red',
      'Project Manager': 'blue',
      'Architect': 'purple',
      'Civil Engineer': 'blue',
      'Structural Engineer': 'blue',
      'Mechanical Engineer': 'blue',
      'Electrical Engineer': 'blue',
      'Landscaper': 'green',
      'Demolition Specialist': 'red',
      'Scaffolding Specialist': 'orange',
      'Glass Installer': 'cyan',
      'Insulation Specialist': 'yellow',
      'Drywall Installer': 'gray',
      'Tile Setter': 'teal',
      'Cabinet Maker': 'brown',
      'Millwright': 'orange',
      'Ironworker': 'red',
      'Sheet Metal Worker': 'gray',
      'Pipefitter': 'blue',
      'Boilermaker': 'red',
      'Crane Operator': 'green',
      'Surveyor': 'blue',
      'Quality Control Inspector': 'green',
      'Estimator': 'blue',
      'Supervisor': 'blue',
      'Other': 'gray',
    };
    return colors[career] || 'green';
  };

  if (isLoading) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.xl" pt={20} pb={10}>
          <Text>Loading talents...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="xl" color={textColor}>Construction Talents</Heading>
          </HStack>

          {/* Search and Filters */}
          <Box p={6} bg={cardBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
            <VStack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Search talents by name, career, or certifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <HStack spacing={4} width="full">
                <Select
                  name="career"
                  placeholder="Career Type"
                  value={filters.career}
                  onChange={handleFilterChange}
                >
                  <option value="Carpenter">Carpenter</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Mason">Mason</option>
                  <option value="Welder">Welder</option>
                  <option value="Painter">Painter</option>
                  <option value="HVAC Technician">HVAC Technician</option>
                  <option value="Roofing Specialist">Roofing Specialist</option>
                  <option value="Flooring Installer">Flooring Installer</option>
                  <option value="Concrete Worker">Concrete Worker</option>
                  <option value="Heavy Equipment Operator">Heavy Equipment Operator</option>
                  <option value="Safety Inspector">Safety Inspector</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Architect">Architect</option>
                  <option value="Civil Engineer">Civil Engineer</option>
                  <option value="Structural Engineer">Structural Engineer</option>
                  <option value="Mechanical Engineer">Mechanical Engineer</option>
                  <option value="Electrical Engineer">Electrical Engineer</option>
                  <option value="Landscaper">Landscaper</option>
                  <option value="Demolition Specialist">Demolition Specialist</option>
                  <option value="Scaffolding Specialist">Scaffolding Specialist</option>
                  <option value="Glass Installer">Glass Installer</option>
                  <option value="Insulation Specialist">Insulation Specialist</option>
                  <option value="Drywall Installer">Drywall Installer</option>
                  <option value="Tile Setter">Tile Setter</option>
                  <option value="Cabinet Maker">Cabinet Maker</option>
                  <option value="Millwright">Millwright</option>
                  <option value="Ironworker">Ironworker</option>
                  <option value="Sheet Metal Worker">Sheet Metal Worker</option>
                  <option value="Pipefitter">Pipefitter</option>
                  <option value="Boilermaker">Boilermaker</option>
                  <option value="Crane Operator">Crane Operator</option>
                  <option value="Surveyor">Surveyor</option>
                  <option value="Quality Control Inspector">Quality Control Inspector</option>
                  <option value="Estimator">Estimator</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Other">Other</option>
                </Select>

                <Select
                  name="verification"
                  placeholder="Verification Status"
                  value={filters.verification}
                  onChange={handleFilterChange}
                >
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </Select>

                <Select
                  name="rating"
                  placeholder="Rating Range"
                  value={filters.rating}
                  onChange={handleFilterChange}
                >
                  <option value="4.5-5.0">4.5 - 5.0 Stars</option>
                  <option value="4.0-4.5">4.0 - 4.5 Stars</option>
                  <option value="3.5-4.0">3.5 - 4.0 Stars</option>
                  <option value="3.0-3.5">3.0 - 3.5 Stars</option>
                </Select>
              </HStack>
            </VStack>
          </Box>

          {/* Talents Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredTalents.map((talent) => (
              <Card key={talent.address} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stack spacing={4}>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color={textColor}>{talent.name}</Heading>
                        <Text color="gray.500" fontSize="sm">
                          {talent.gender} • {new Date(talent.birthday).getFullYear()}
                        </Text>
                      </VStack>
                      <Avatar size="sm" name={talent.name} />
                    </HStack>

                    <HStack>
                      <Badge colorScheme={getCareerColor(talent.career)}>{talent.career}</Badge>
                      {talent.isVerified ? (
                        <Badge colorScheme="green" leftIcon={<CheckCircleIcon />}>
                          Verified
                        </Badge>
                      ) : (
                        <Badge colorScheme="gray">Unverified</Badge>
                      )}
                    </HStack>

                    <HStack>
                      <StarIcon color="yellow.400" />
                      <Text color={textColor} fontWeight="bold">
                        {talent.rating} ({talent.projectCount} projects)
                      </Text>
                    </HStack>

                    <Divider />

                    <VStack align="start" spacing={2}>
                      <Text color={textColor} fontWeight="semibold" fontSize="sm">
                        Certifications:
                      </Text>
                      <HStack flexWrap="wrap" spacing={1}>
                        {talent.certifications.slice(0, 3).map((cert, index) => (
                          <Badge key={index} size="sm" colorScheme="blue" variant="subtle">
                            {cert}
                          </Badge>
                        ))}
                        {talent.certifications.length > 3 && (
                          <Badge size="sm" colorScheme="gray" variant="subtle">
                            +{talent.certifications.length - 3} more
                          </Badge>
                        )}
                      </HStack>
                    </VStack>

                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      onClick={() => handleViewTalent(talent)}
                      width="full"
                    >
                      View Profile
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Talents; 