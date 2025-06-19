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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  useDisclosure,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, EditIcon, CloseIcon } from '@chakra-ui/icons';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';
import { useRouter } from 'next/router';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    requiredSkills: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    additionalDescription: '',
    additionalRequiredSkills: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const modalBg = useColorModeValue('white', 'gray.800');
  const modalBorderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');

  const router = useRouter();
  const toast = useToast();

  // Career options for filtering
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
    checkConnection();
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, filters, projects]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const fetchProjects = async () => {
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
      const projectCount = await contract.projectCount();
      const projectsArray = [];
      for (let i = 1; i <= projectCount.toNumber(); i++) {
        try {
          const [title, description, budget, client, isActive, deadline, requiredSkills] = await contract.getProjectInfo(i);
          if (isActive) {
            projectsArray.push({
              id: i,
              title,
              description,
              budget: ethers.utils.formatEther(budget),
              client,
              deadline: new Date(deadline.toNumber() * 1000),
              isActive,
              requiredSkills: requiredSkills || [],
              // Additional fields (stored in localStorage for now)
              additionalDescription: localStorage.getItem(`project_${i}_additionalDesc`) || '',
              additionalRequiredSkills: localStorage.getItem(`project_${i}_additionalSkills`) || '',
            });
          }
        } catch (error) {
          // skip if project does not exist
        }
      }
      setProjects(projectsArray);
      setFilteredProjects(projectsArray);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.additionalDescription && project.additionalDescription.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Required skills filter
    if (filters.requiredSkills) {
      filtered = filtered.filter(project => {
        const allSkills = [
          ...project.requiredSkills,
          ...(project.additionalRequiredSkills ? project.additionalRequiredSkills.split(',').map(s => s.trim()) : [])
        ];
        return allSkills.some(skill => skill.toLowerCase().includes(filters.requiredSkills.toLowerCase()));
      });
    }

    // Budget filter
    if (filters.budget) {
      const [min, max] = filters.budget.split('-').map(Number);
      filtered = filtered.filter(project => {
        const budget = Number(project.budget);
        return budget >= min && budget <= max;
      });
    }

    setFilteredProjects(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openUpdateModal = (project) => {
    setSelectedProject(project);
    setUpdateForm({
      additionalDescription: '',
      additionalRequiredSkills: '',
    });
    onOpen();
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;

    setIsUpdating(true);
    try {
      // Update local storage with new content (appending to existing)
      const currentDesc = selectedProject.additionalDescription || '';
      const currentSkills = selectedProject.additionalRequiredSkills || '';

      const newDesc = currentDesc + (updateForm.additionalDescription ? '\n' + updateForm.additionalDescription : '');
      const newSkills = currentSkills + (updateForm.additionalRequiredSkills ? ', ' + updateForm.additionalRequiredSkills : '');

      localStorage.setItem(`project_${selectedProject.id}_additionalDesc`, newDesc);
      localStorage.setItem(`project_${selectedProject.id}_additionalSkills`, newSkills);

      // Update state
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? { ...project, additionalDescription: newDesc, additionalRequiredSkills: newSkills }
          : project
      ));

      // Reset form
      setUpdateForm({
        additionalDescription: '',
        additionalRequiredSkills: '',
      });

      onClose();
      toast({
        title: 'Project Updated',
        description: 'Your project has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update project. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to close this project? This action cannot be undone.')) {
      return;
    }

    setIsClosing(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        signer
      );

      const tx = await contract.closeProject(projectId);
      await tx.wait();

      // Refresh projects list
      fetchProjects();
      
      toast({
        title: 'Project Closed',
        description: 'The project has been closed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error closing project:', error);
      toast({
        title: 'Close Failed',
        description: 'Failed to close project. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh">
        <Navigation />
        <Container maxW="container.xl" pt={20} pb={10}>
          <VStack spacing={8} align="center">
            <Spinner size="xl" />
            <Text>Loading projects...</Text>
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
          <HStack justify="space-between" align="center">
            <Heading size="xl" color={textColor}>Projects</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="lg"
              onClick={() => router.push('/post-project')}
            >
              Post New Project
            </Button>
          </HStack>

          {/* Search and Filters */}
          <Box p={6} bg={cardBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
            <VStack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Search projects by title, description, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <HStack spacing={4} width="full" wrap="wrap">
                <Select
                  name="requiredSkills"
                  placeholder="Filter by Required Skills"
                  value={filters.requiredSkills}
                  onChange={handleFilterChange}
                  maxW="250px"
                >
                  {careerOptions.map((career) => (
                    <option key={career} value={career}>
                      {career}
                    </option>
                  ))}
                </Select>

                <Select
                  name="budget"
                  placeholder="Budget Range"
                  value={filters.budget}
                  onChange={handleFilterChange}
                  maxW="200px"
                >
                  <option value="0-1">0 - 1 ETH</option>
                  <option value="1-5">1 - 5 ETH</option>
                  <option value="5-10">5 - 10 ETH</option>
                  <option value="10-50">10 - 50 ETH</option>
                  <option value="50-100">50+ ETH</option>
                </Select>
              </HStack>
            </VStack>
          </Box>

          {/* Results Count */}
          <Text color="gray.500">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
          </Text>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredProjects.map((project) => (
                <Card key={project.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stack spacing={4}>
                      <Heading size="md" color={textColor}>{project.title}</Heading>
                      <Text color={textColor} noOfLines={3}>
                        {project.description}
                      </Text>
                      {project.additionalDescription && (
                        <Text color="gray.600" fontSize="sm" noOfLines={2}>
                          {project.additionalDescription}
                        </Text>
                      )}
                      
                      {/* Required Skills */}
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" mb={2}>Required Skills:</Text>
                        <HStack flexWrap="wrap" spacing={1}>
                          {project.requiredSkills && project.requiredSkills.length > 0 ? (
                            project.requiredSkills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} colorScheme="blue" size="sm">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <Text fontSize="sm" color="gray.500">No skills specified</Text>
                          )}
                          {project.requiredSkills && project.requiredSkills.length > 3 && (
                            <Badge colorScheme="gray" size="sm">
                              +{project.requiredSkills.length - 3} more
                            </Badge>
                          )}
                        </HStack>
                        {project.additionalRequiredSkills && (
                          <HStack flexWrap="wrap" spacing={1} mt={2}>
                            {project.additionalRequiredSkills.split(',').slice(0, 2).map((skill, index) => (
                              <Badge key={index} colorScheme="green" size="sm">
                                {skill.trim()}
                              </Badge>
                            ))}
                            {project.additionalRequiredSkills.split(',').length > 2 && (
                              <Badge colorScheme="gray" size="sm">
                                +{project.additionalRequiredSkills.split(',').length - 2} more
                              </Badge>
                            )}
                          </HStack>
                        )}
                      </Box>

                      <Divider />
                      
                      <HStack justify="space-between">
                        <Text color={textColor} fontWeight="bold">
                          Budget: {Number(project.budget).toFixed(2)} ETH
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          Deadline: {project.deadline.toLocaleDateString()}
                        </Text>
                      </HStack>

                      {/* Owner Actions */}
                      {currentAccount && currentAccount.toLowerCase() === project.client.toLowerCase() && (
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            leftIcon={<EditIcon />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => openUpdateModal(project)}
                          >
                            Update
                          </Button>
                          <Button
                            size="sm"
                            leftIcon={<CloseIcon />}
                            colorScheme="red"
                            variant="outline"
                            onClick={() => handleCloseProject(project.id)}
                            isLoading={isClosing}
                          >
                            Close
                          </Button>
                        </HStack>
                      )}

                      <Text color="gray.500" fontSize="xs" fontFamily="mono">
                        Posted by: {project.client.slice(0, 6)}...{project.client.slice(-4)}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Alert status="info">
              <AlertIcon />
              No projects found matching your search criteria.
            </Alert>
          )}
        </VStack>
      </Container>

      {/* Update Project Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={modalBg} borderWidth="1px" borderColor={modalBorderColor}>
          <ModalHeader color={textColor}>Update Project</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color={textColor}>Additional Description</FormLabel>
                <Textarea
                  name="additionalDescription"
                  value={updateForm.additionalDescription}
                  onChange={handleUpdateFormChange}
                  placeholder="Add more details to the project description..."
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Additional Required Skills</FormLabel>
                <Input
                  name="additionalRequiredSkills"
                  value={updateForm.additionalRequiredSkills}
                  onChange={handleUpdateFormChange}
                  placeholder="Add more required skills (comma-separated)"
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} color={textColor}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdateProject}
              isLoading={isUpdating}
            >
              Update Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Projects; 