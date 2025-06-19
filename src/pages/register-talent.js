import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useColorModeValue,
  useToast,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

export default function RegisterTalent() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    physicalAddress: '',
    governmentId: '',
    career: '',
    certifications: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCertifications, setFilteredCertifications] = useState([]);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const toast = useToast();

  // Construction certifications list
  const certificationOptions = useMemo(() => [
    'OSHA 10',
    'OSHA 30',
    'CSCS Card',
    'SST Card (Site Safety Training)',
    'MSHA Certification',
    'Confined Space Entry Certification',
    'Working at Heights Certification',
    'White Card (Australia)',
    'Green Card (Safe Pass – Ireland)',
    'Construction Induction Card (New Zealand)',
    'CIC (Construction Industry Card – Singapore)',
    'Qatar Work Permit Safety Certificate',
    'CPCS Card (Construction Plant Competence Scheme)',
    'NPORS Card',
    'HIAB (Lorry Loader) Certification',
    'Forklift License (RTITB / OSHA)',
    'Scaffolding Certification (CISRS)',
    'Boom Lift / Scissor Lift Certification (IPAF)',
    'Crane Operator Certification (NCCCO / CPCS)',
    'NEBOSH IGC (International General Certificate)',
    'IOSH Managing Safely',
    'CSP (Certified Safety Professional)',
    'ASP (Associate Safety Professional)',
    'CMAA CM (Certified Construction Manager)',
    'PMI PMP (Project Management Professional)',
    'RICS Membership / MRICS',
    'FIDIC Contract Training Certificate',
    'Other'
  ], []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoize the filter function to prevent unnecessary re-renders
  const filterCertifications = useCallback((search, selectedCerts) => {
    if (search) {
      return certificationOptions.filter(option =>
        option.toLowerCase().includes(search.toLowerCase()) &&
        !selectedCerts.includes(option)
      );
    }
    return [];
  }, [certificationOptions]);

  useEffect(() => {
    const filtered = filterCertifications(searchTerm, formData.certifications);
    setFilteredCertifications(filtered);
    setShowDropdown(searchTerm.length > 0 && filtered.length > 0);
  }, [searchTerm, formData.certifications, filterCertifications]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificationSelect = (certification) => {
    if (!formData.certifications.includes(certification)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certification]
      }));
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleCertificationRemove = (certificationToRemove) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certificationToRemove)
    }));
  };

  // Validation function to check if form is complete
  const isFormValid = () => {
    const nameValid = formData.name.trim() !== '';
    const genderValid = formData.gender !== '';
    const birthdayValid = formData.birthday !== '';
    const addressValid = formData.physicalAddress.trim() !== '';
    const idValid = formData.governmentId.trim() !== '';
    const careerValid = formData.career !== '';
    const certificationsValid = formData.certifications.length > 0;

    return nameValid && genderValid && birthdayValid && addressValid && idValid && careerValid && certificationsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Full name is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.gender) {
      toast({
        title: 'Validation Error',
        description: 'Please select your gender.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.birthday) {
      toast({
        title: 'Validation Error',
        description: 'Please select your date of birth.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.physicalAddress.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Physical address is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.governmentId.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Government ID is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.career) {
      toast({
        title: 'Validation Error',
        description: 'Please select your career/profession.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (formData.certifications.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one certification.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        signer
      );

      const tx = await contract.registerTalent(
        formData.name,
        formData.gender,
        formData.birthday,
        formData.physicalAddress,
        formData.governmentId,
        formData.career,
        formData.certifications
      );

      await tx.wait();

      toast({
        title: 'Registration successful!',
        description: 'Your talent profile has been created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/profile');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'There was an error registering your profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');
  const dropdownBg = useColorModeValue('white', 'gray.700');
  const dropdownBorderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.md" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" color={textColor} textAlign="center">
            Register as a Talent
          </Heading>
          <Box
            p={8}
            bg={bgColor}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="lg"
          >
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} textAlign="center" pb={4}>
              Fill in your details to create your talent profile
            </Text>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="Select gender"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Physical Address</FormLabel>
                  <Textarea
                    name="physicalAddress"
                    value={formData.physicalAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your physical address"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Government ID</FormLabel>
                  <Input
                    name="governmentId"
                    value={formData.governmentId}
                    onChange={handleInputChange}
                    placeholder="Enter your government ID number"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Career/Profession</FormLabel>
                  <Select
                    name="career"
                    value={formData.career}
                    onChange={handleInputChange}
                    placeholder="Select your career or profession"
                    bg={inputBg}
                    borderColor={inputBorderColor}
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
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Certifications</FormLabel>
                  <Box position="relative" ref={dropdownRef}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.500" />
                      </InputLeftElement>
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search and select certifications..."
                        bg={inputBg}
                        borderColor={inputBorderColor}
                        _hover={{ borderColor: 'blue.400' }}
                        _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                        onFocus={() => setShowDropdown(true)}
                      />
                    </InputGroup>
                    
                    {showDropdown && filteredCertifications.length > 0 && (
                      <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        right={0}
                        bg={dropdownBg}
                        borderWidth="1px"
                        borderColor={dropdownBorderColor}
                        borderRadius="md"
                        boxShadow="lg"
                        zIndex={10}
                        maxH="200px"
                        overflowY="auto"
                      >
                        <List spacing={0}>
                          {filteredCertifications.map((certification) => (
                            <ListItem
                              key={certification}
                              px={4}
                              py={2}
                              cursor="pointer"
                              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                              onClick={() => handleCertificationSelect(certification)}
                            >
                              <Text color={textColor} fontSize="sm">{certification}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>

                  {formData.certifications.length > 0 && (
                    <HStack spacing={2} flexWrap="wrap" mt={2}>
                      {formData.certifications.map((certification) => (
                        <Tag
                          key={certification}
                          size="md"
                          colorScheme="green"
                          borderRadius="full"
                        >
                          <TagLabel>{certification}</TagLabel>
                          <TagCloseButton onClick={() => handleCertificationRemove(certification)} />
                        </Tag>
                      ))}
                    </HStack>
                  )}
                  
                  {formData.certifications.length === 0 && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Please select at least one certification.
                    </Text>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Registering..."
                  isDisabled={!isFormValid()}
                  bg={useColorModeValue('blue.600', 'blue.400')}
                  color="white"
                  _hover={{
                    bg: useColorModeValue('blue.700', 'blue.500'),
                  }}
                >
                  Register
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
} 