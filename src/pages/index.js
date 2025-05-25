import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Badge,
  HStack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';
import { useState, useEffect } from 'react';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      const projects = await contract.getProjects();
      setProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh">
      <Navigation />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="center" textAlign="center">
            <Heading size="2xl" color={textColor}>
              Welcome to Construction Talent
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Connect with top construction professionals and find your next project
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => router.push('/post-project')}
            >
              Post a Project
            </Button>
          </VStack>

          <Heading size="lg" color={textColor}>
            Latest Projects
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {projects.slice(0, 6).map((project) => (
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

          <Button
            variant="outline"
            colorScheme="blue"
            size="lg"
            onClick={() => router.push('/projects')}
          >
            View All Projects
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home; 