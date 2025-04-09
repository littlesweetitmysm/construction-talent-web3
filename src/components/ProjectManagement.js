import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Button,
  useToast,
  Spinner,
  SimpleGrid,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const ProjectManagement = ({ provider, address }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      if (!provider) return;

      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(
          contractAddress,
          ConstructionTalent.abi,
          provider
        );

        const count = await contract.projectCount();
        const projectPromises = [];

        for (let i = 0; i < count; i++) {
          projectPromises.push(contract.getProjectInfo(i));
        }

        const projectData = await Promise.all(projectPromises);
        setProjects(projectData.map((data, index) => ({
          id: index,
          title: data.title,
          description: data.description,
          budget: ethers.utils.formatEther(data.budget),
          client: data.client,
          isActive: data.isActive,
          deadline: new Date(data.deadline.toNumber() * 1000).toLocaleDateString(),
        })));
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch projects.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [provider]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signer = provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(
        contractAddress,
        ConstructionTalent.abi,
        signer
      );

      const deadline = Math.floor(new Date(formData.deadline).getTime() / 1000);
      const budget = ethers.utils.parseEther(formData.budget);

      const tx = await contract.createProject(
        formData.title,
        formData.description,
        budget,
        [], // requiredSkills array (empty for now)
        deadline
      );

      await tx.wait();

      toast({
        title: 'Project Created',
        description: 'Your project has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      // Refresh projects list
      window.location.reload();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Projects</Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            Create Project
          </Button>
        </HStack>

        {projects.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Text color="gray.500">No projects found.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {projects.map((project) => (
              <Box
                key={project.id}
                p={4}
                borderWidth={1}
                borderRadius="lg"
                boxShadow="sm"
              >
                <VStack align="stretch" spacing={2}>
                  <Heading size="sm">{project.title}</Heading>
                  <Text fontSize="sm" noOfLines={2}>
                    {project.description}
                  </Text>
                  <HStack justify="space-between">
                    <Badge colorScheme={project.isActive ? 'green' : 'red'}>
                      {project.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Text fontSize="sm" fontWeight="medium">
                      {project.budget} ETH
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    Deadline: {project.deadline}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter project title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter project description"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Budget (ETH)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.budget}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, budget: value }))
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Deadline</FormLabel>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  loadingText="Creating..."
                  width="full"
                >
                  Create Project
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProjectManagement; 