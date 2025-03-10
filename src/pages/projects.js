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
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { getProjectInfo } from '../utils/contract';
import ProjectCreation from '../components/ProjectCreation';
import Navigation from '../components/Navigation';

const Projects = ({ provider, signer }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // In a real application, you would fetch the total number of projects
        // and load them in batches. For this example, we'll load the first 10.
        const projectPromises = Array.from({ length: 10 }, (_, i) =>
          getProjectInfo(provider, i + 1)
        );
        const projectResults = await Promise.all(projectPromises);
        setProjects(projectResults.filter(project => project.title)); // Filter out empty projects
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (provider) {
      loadProjects();
    }
  }, [provider]);

  const formatBudget = (budget) => {
    return ethers.utils.formatEther(budget) + ' ETH';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading as="h1" size="xl">
              Available Projects
            </Heading>
            <Button colorScheme="blue" onClick={onOpen}>
              Create Project
            </Button>
          </HStack>

          {loading ? (
            <Text>Loading projects...</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {projects.map((project, index) => (
                <Box
                  key={index}
                  p={6}
                  borderWidth={1}
                  borderRadius="lg"
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
                >
                  <VStack align="stretch" spacing={4}>
                    <Heading as="h3" size="md">
                      {project.title}
                    </Heading>
                    <Text color="gray.600">{project.description}</Text>
                    <HStack justify="space-between">
                      <Badge colorScheme="green">
                        Budget: {formatBudget(project.budget)}
                      </Badge>
                      <Badge colorScheme={project.isActive ? 'blue' : 'gray'}>
                        {project.isActive ? 'Active' : 'Assigned'}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      Deadline: {formatDate(project.deadline)}
                    </Text>
                    {project.isActive && (
                      <Button colorScheme="blue" size="sm">
                        Apply
                      </Button>
                    )}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

      <ProjectCreation
        isOpen={isOpen}
        onClose={onClose}
        signer={signer}
      />
    </>
  );
};

export default Projects; 