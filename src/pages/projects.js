import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useToast,
  Input,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  InputGroup,
  InputLeftElement,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';
import Navigation from '../components/Navigation';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [budgetRange, setBudgetRange] = useState([0, 100]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const toast = useToast();

  const projectTypes = ['all', 'residential', 'commercial', 'industrial', 'infrastructure'];
  const skillsList = [
    'Electrical',
    'Plumbing',
    'Carpentry',
    'Masonry',
    'HVAC',
    'Painting',
    'Roofing',
    'General Construction'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ConstructionTalent.abi,
          provider
        );

        const projectCount = await contract.projectCount();
        const fetchedProjects = [];

        for (let i = 1; i <= projectCount; i++) {
          const project = await contract.getProjectInfo(i);
          fetchedProjects.push({
            id: i,
            title: project.title,
            description: project.description,
            budget: ethers.utils.formatEther(project.budget),
            client: project.client,
            isActive: project.isActive,
            deadline: new Date(project.deadline * 1000).toLocaleDateString(),
            type: project.title.toLowerCase().includes('residential') ? 'residential' :
                  project.title.toLowerCase().includes('commercial') ? 'commercial' :
                  project.title.toLowerCase().includes('industrial') ? 'industrial' : 'infrastructure'
          });
        }

        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedType, budgetRange, selectedSkills, projects]);

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(project => project.type === selectedType);
    }

    // Budget filter
    filtered = filtered.filter(project => {
      const budget = parseFloat(project.budget);
      return budget >= budgetRange[0] && budget <= budgetRange[1];
    });

    // Skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(project =>
        selectedSkills.some(skill =>
          project.description.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Navigation />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" mb={6}>Find Projects</Heading>

          {/* Search and Filters */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="base">
            <VStack spacing={6}>
              {/* Search Bar */}
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* Filters */}
              <HStack spacing={6} w="full">
                <Select
                  size="lg"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {projectTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </Select>

                <Select
                  size="lg"
                  placeholder="Add skill filter"
                  onChange={(e) => handleSkillSelect(e.target.value)}
                >
                  {skillsList.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </Select>
              </HStack>

              {/* Budget Range */}
              <Box w="full">
                <Text mb={2}>Budget Range (ETH): {budgetRange[0]} - {budgetRange[1]}</Text>
                <RangeSlider
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(val) => setBudgetRange(val)}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
              </Box>

              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <Flex wrap="wrap" gap={2}>
                  {selectedSkills.map(skill => (
                    <Tag
                      key={skill}
                      size="lg"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                    >
                      <TagLabel>{skill}</TagLabel>
                      <TagCloseButton onClick={() => removeSkill(skill)} />
                    </Tag>
                  ))}
                </Flex>
              )}
            </VStack>
          </Box>

          {/* Projects Grid */}
          {loading ? (
            <Text>Loading projects...</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredProjects.map((project) => (
                <Box
                  key={project.id}
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
                >
                  <VStack align="stretch" spacing={4}>
                    <Heading as="h3" size="md">
                      {project.title}
                    </Heading>
                    <Text color="gray.600" noOfLines={3}>
                      {project.description}
                    </Text>
                    <HStack justify="space-between">
                      <Badge colorScheme="purple" fontSize="sm">
                        {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                      </Badge>
                      <Badge colorScheme={project.isActive ? 'green' : 'red'}>
                        {project.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </HStack>
                    <Text fontWeight="bold" color="blue.600">
                      {project.budget} ETH
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Deadline: {project.deadline}
                    </Text>
                    <Button
                      colorScheme="blue"
                      size="md"
                      isDisabled={!project.isActive}
                    >
                      {project.isActive ? 'Apply Now' : 'Closed'}
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Projects; 