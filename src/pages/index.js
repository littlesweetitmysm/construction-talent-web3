import { useState, useEffect } from 'react';
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
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

export default function Home() {
  const [account, setAccount] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    setIsMounted(true);
    checkConnection();
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', () => window.location.reload());

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    if (account) {
      fetchProjects();
    }
  }, [account]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
    setIsLoading(false);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
    } else {
      setAccount(accounts[0]);
    }
  };

  const fetchProjects = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        provider
      );

      const projectCount = await contract.getProjectCount();
      const projects = [];

      for (let i = 0; i < projectCount; i++) {
        const project = await contract.getProject(i);
        projects.push({
          id: i,
          title: project.title,
          description: project.description,
          budget: ethers.utils.formatEther(project.budget),
          deadline: new Date(project.deadline.toNumber() * 1000).toLocaleDateString(),
          status: project.status,
          client: project.client,
        });
      }

      setProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Box minH="100vh" bg={bgColor} color={textColor}>
      <Container maxW="container.xl" pt={20}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" py={10}>
            <Heading size="2xl" mb={4}>
              Welcome to Construction Talent
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
              Connect with top construction professionals and find your next project
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {projects.slice(0, 6).map((project) => (
              <Card key={project.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="md">{project.title}</Heading>
                    <Text noOfLines={2}>{project.description}</Text>
                    <HStack justify="space-between">
                      <Badge colorScheme="blue">{project.status}</Badge>
                      <Text fontWeight="bold">{project.budget} ETH</Text>
                    </HStack>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                      Deadline: {project.deadline}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Box textAlign="center" py={8}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => router.push('/projects')}
            >
              View All Projects
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
} 