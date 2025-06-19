import { useState, useRef, useEffect } from 'react';
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

  // Comprehensive construction certifications
  const certificationOptions = [
    // Safety Certifications
    'OSHA 10-Hour Construction Safety',
    'OSHA 30-Hour Construction Safety',
    'OSHA Confined Space Entry',
    'OSHA Fall Protection',
    'OSHA Scaffolding Safety',
    'OSHA Excavation Safety',
    'OSHA Crane Safety',
    'OSHA Electrical Safety',
    'OSHA Hazard Communication',
    'OSHA Respiratory Protection',
    'OSHA Lockout/Tagout',
    'OSHA Hot Work Safety',
    'OSHA Welding Safety',
    'OSHA Asbestos Awareness',
    'OSHA Lead Safety',
    'OSHA Silica Safety',
    'OSHA Noise Safety',
    'OSHA Personal Protective Equipment',
    'OSHA Emergency Response',
    'OSHA First Aid/CPR',
    
    // Trade-Specific Certifications
    'Journeyman Electrician License',
    'Master Electrician License',
    'Electrical Contractor License',
    'NEC Code Certification',
    'Solar Panel Installation',
    'EV Charger Installation',
    'Smart Home Systems',
    'Low Voltage Systems',
    'Journeyman Plumber License',
    'Master Plumber License',
    'Plumbing Contractor License',
    'Gas Fitting License',
    'Backflow Prevention',
    'Water Treatment Systems',
    'Journeyman Carpenter',
    'Master Carpenter',
    'Cabinet Making',
    'Finish Carpentry',
    'Rough Carpentry',
    'Formwork Specialist',
    'Concrete Finishing',
    'Masonry Certification',
    'Brick Laying',
    'Stone Masonry',
    'Tile Setting',
    'Terrazzo Installation',
    'Welding Certification',
    'Structural Welding',
    'Pipe Welding',
    'Aluminum Welding',
    'Stainless Steel Welding',
    'HVAC Technician',
    'HVAC Installation',
    'HVAC Maintenance',
    'Refrigeration Systems',
    'Air Conditioning',
    'Heating Systems',
    'Boiler Operation',
    'Chiller Systems',
    'Roofing Certification',
    'Shingle Roofing',
    'Metal Roofing',
    'Flat Roofing',
    'Green Roofing',
    'Solar Roofing',
    'Flooring Installation',
    'Hardwood Flooring',
    'Laminate Flooring',
    'Vinyl Flooring',
    'Carpet Installation',
    'Epoxy Flooring',
    'Concrete Staining',
    'Heavy Equipment Operation',
    'Crane Operation',
    'Forklift Operation',
    'Excavator Operation',
    'Bulldozer Operation',
    'Backhoe Operation',
    'Skid Steer Operation',
    'Tower Crane Operation',
    'Mobile Crane Operation',
    'Demolition Specialist',
    'Controlled Demolition',
    'Asbestos Abatement',
    'Lead Abatement',
    'Mold Remediation',
    'Scaffolding Erection',
    'Scaffold Safety',
    'Glass Installation',
    'Auto Glass',
    'Architectural Glass',
    'Insulation Installation',
    'Fiberglass Insulation',
    'Spray Foam Insulation',
    'Cellulose Insulation',
    'Drywall Installation',
    'Drywall Finishing',
    'Acoustic Ceiling',
    'Cabinet Installation',
    'Millwork Installation',
    'Ironworker Certification',
    'Structural Steel',
    'Reinforcing Steel',
    'Ornamental Iron',
    'Sheet Metal Worker',
    'Ductwork Fabrication',
    'Pipefitting',
    'Steam Fitting',
    'Gas Fitting',
    'Boilermaker',
    'Pressure Vessel',
    'Surveying',
    'Land Surveying',
    'Construction Surveying',
    'Quality Control',
    'Quality Assurance',
    'Project Management',
    'Construction Management',
    'Estimating',
    'Blueprint Reading',
    'AutoCAD',
    'Revit',
    'BIM Specialist',
    'LEED Certification',
    'Green Building',
    'Energy Efficiency',
    'Building Codes',
    'International Building Code',
    'National Electrical Code',
    'Uniform Plumbing Code',
    'Fire Safety',
    'Building Inspector',
    'Code Compliance',
    'Environmental Compliance',
    'Stormwater Management',
    'Erosion Control',
    'Waste Management',
    'Recycling Specialist',
    'Sustainable Construction',
    'Net Zero Building',
    'Passive House',
    'Energy Star',
    'WaterSense',
    'Other'
  ];

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

  useEffect(() => {
    if (searchTerm) {
      const filtered = certificationOptions.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !formData.certifications.includes(option)
      );
      setFilteredCertifications(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCertifications([]);
      setShowDropdown(false);
    }
  }, [searchTerm, formData.certifications]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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