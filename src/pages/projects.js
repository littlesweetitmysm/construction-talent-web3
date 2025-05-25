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
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';
import { useRouter } from 'next/router';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: '',
    budget: '',
    deadline: '',
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const modalBg = useColorModeValue('white', 'gray.800');
  const modalBorderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');

  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, filters, projects]);

  const fetchProjects = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      const projectCount = await contract.projectCount();
      const projectsArray = [];

      for (let i = 1; i <= projectCount; i++) {
        const project = await contract.projects(i);
        if (project.isActive) {
          projectsArray.push({
            id: i,
            title: project.title,
            description: project.description,
            budget: ethers.utils.formatEther(project.budget),
            client: project.client,
            deadline: new Date(project.deadline.toNumber() * 1000),
            type: project.projectType,
            status: project.status,
          });
        }
      }

      setProjects(projectsArray);
      setFilteredProjects(projectsArray);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(project => project.type === filters.type);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
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

  const handleNewProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProject = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        signer
      );

      const tx = await contract.createProject(
        newProject.title,
        newProject.description,
        newProject.type,
        ethers.utils.parseEther(newProject.budget),
        Math.floor(new Date(newProject.deadline).getTime() / 1000)
      );

      await tx.wait();
      onClose();
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

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
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <HStack spacing={4} width="full">
                <Select
                  name="type"
                  placeholder="Project Type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="infrastructure">Infrastructure</option>
                </Select>

                <Select
                  name="status"
                  placeholder="Project Status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>

                <Select
                  name="budget"
                  placeholder="Budget Range"
                  value={filters.budget}
                  onChange={handleFilterChange}
                >
                  <option value="0-10000">$0 - $10,000</option>
                  <option value="10000-50000">$10,000 - $50,000</option>
                  <option value="50000-100000">$50,000 - $100,000</option>
                  <option value="100000-500000">$100,000 - $500,000</option>
                  <option value="500000-1000000">$500,000+</option>
                </Select>
              </HStack>
            </VStack>
          </Box>

          {/* Projects Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredProjects.map((project) => (
              <Card key={project.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stack spacing={4}>
                    <Heading size="md" color={textColor}>{project.title}</Heading>
                    <Text color={textColor} noOfLines={3}>
                      {project.description}
                    </Text>
                    <HStack>
                      <Badge colorScheme="green">{project.type}</Badge>
                      <Badge colorScheme="blue">{project.status}</Badge>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text color={textColor} fontWeight="bold">
                        Budget: ${Number(project.budget).toLocaleString()}
                      </Text>
                      <Button size="sm" colorScheme="blue">
                        View Details
                      </Button>
                    </HStack>
                    <Text color="gray.500" fontSize="sm">
                      Deadline: {project.deadline.toLocaleDateString()}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Post Project Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={modalBg} borderWidth="1px" borderColor={modalBorderColor}>
          <ModalHeader color={textColor}>Post New Project</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={textColor}>Project Title</FormLabel>
                <Input
                  name="title"
                  value={newProject.title}
                  onChange={handleNewProjectChange}
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
                  value={newProject.description}
                  onChange={handleNewProjectChange}
                  placeholder="Enter project description"
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Project Type</FormLabel>
                <Select
                  name="type"
                  value={newProject.type}
                  onChange={handleNewProjectChange}
                  placeholder="Select project type"
                  bg={inputBg}
                  borderColor={inputBorderColor}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="infrastructure">Infrastructure</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Budget (ETH)</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField
                    name="budget"
                    value={newProject.budget}
                    onChange={handleNewProjectChange}
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
                  value={newProject.deadline}
                  onChange={handleNewProjectChange}
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
            <Button colorScheme="blue" onClick={handleSubmitProject}>
              Post Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Projects; 