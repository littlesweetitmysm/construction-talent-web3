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
  NumberInput,
  NumberInputField,
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
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SearchIcon } from '@chakra-ui/icons';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const PostProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    requiredSkills: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');
  const dropdownBg = useColorModeValue('white', 'gray.700');
  const dropdownBorderColor = useColorModeValue('gray.200', 'gray.600');

  // All career options
  const careerOptions = [
    'Carpenter',
    'Electrician',
    'Plumber',
    'Mason',
    'Welder',
    'Painter',
    'HVAC Technician',
    'Roofing Specialist',
    'Flooring Installer',
    'Concrete Worker',
    'Heavy Equipment Operator',
    'Safety Inspector',
    'Project Manager',
    'Architect',
    'Civil Engineer',
    'Structural Engineer',
    'Mechanical Engineer',
    'Electrical Engineer',
    'Landscaper',
    'Demolition Specialist',
    'Scaffolding Specialist',
    'Glass Installer',
    'Insulation Specialist',
    'Drywall Installer',
    'Tile Setter',
    'Cabinet Maker',
    'Millwright',
    'Ironworker',
    'Sheet Metal Worker',
    'Pipefitter',
    'Boilermaker',
    'Crane Operator',
    'Surveyor',
    'Quality Control Inspector',
    'Estimator',
    'Supervisor',
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
      const filtered = careerOptions.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.requiredSkills.includes(option)
      );
      setFilteredSkills(filtered);
      setShowDropdown(true);
    } else {
      setFilteredSkills([]);
      setShowDropdown(false);
    }
  }, [searchTerm, project.requiredSkills]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillSelect = (skill) => {
    if (!project.requiredSkills.includes(skill)) {
      setProject(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleSkillRemove = (skillToRemove) => {
    setProject(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        signer
      );

      const tx = await contract.createProject(
        project.title,
        project.description,
        ethers.utils.parseEther(project.budget),
        project.requiredSkills,
        Math.floor(new Date(project.deadline).getTime() / 1000)
      );

      await tx.wait();

      toast({
        title: 'Project Created',
        description: 'Your project has been successfully posted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.md" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" color={textColor} textAlign="center">
            Post New Project
          </Heading>

          <Box
            p={8}
            bg={bgColor}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="lg"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Project Title</FormLabel>
                  <Input
                    name="title"
                    value={project.title}
                    onChange={handleChange}
                    placeholder="Enter project title"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    placeholder="Enter project description"
                    rows={4}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Budget (ETH)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      name="budget"
                      value={project.budget}
                      onChange={handleChange}
                      placeholder="Enter budget in ETH"
                      bg={inputBg}
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: 'blue.400' }}
                      _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Deadline</FormLabel>
                  <Input
                    name="deadline"
                    type="date"
                    value={project.deadline}
                    onChange={handleChange}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Required Skills</FormLabel>
                  <Box position="relative" ref={dropdownRef}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.500" />
                      </InputLeftElement>
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search and select required skills..."
                        bg={inputBg}
                        borderColor={inputBorderColor}
                        _hover={{ borderColor: 'blue.400' }}
                        _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                        onFocus={() => setShowDropdown(true)}
                      />
                    </InputGroup>
                    
                    {showDropdown && filteredSkills.length > 0 && (
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
                          {filteredSkills.map((skill) => (
                            <ListItem
                              key={skill}
                              px={4}
                              py={2}
                              cursor="pointer"
                              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                              onClick={() => handleSkillSelect(skill)}
                            >
                              <Text color={textColor}>{skill}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>

                  {project.requiredSkills.length > 0 && (
                    <HStack spacing={2} flexWrap="wrap" mt={2}>
                      {project.requiredSkills.map((skill) => (
                        <Tag
                          key={skill}
                          size="md"
                          colorScheme="blue"
                          borderRadius="full"
                        >
                          <TagLabel>{skill}</TagLabel>
                          <TagCloseButton onClick={() => handleSkillRemove(skill)} />
                        </Tag>
                      ))}
                    </HStack>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Creating Project..."
                >
                  Post Project
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PostProject; 