import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Text,
  Button,
  useToast,
  VStack,
  HStack,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import {
  getProjectInfo,
  getTalentInfo,
  getProjectCount,
  getTalentCount,
} from '../utils/contract';

const Dashboard = ({ provider, signer, account }) => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [talentStats, setTalentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!provider || !account) return;

      try {
        // Load project counts
        const projectCount = await getProjectCount(provider);
        const talentCount = await getTalentCount(provider);

        // Load talent stats if the user is a talent
        const talentInfo = await getTalentInfo(provider, account);
        if (talentInfo) {
          setTalentStats({
            ...talentInfo,
            projectCount: talentCount.toNumber(),
          });
        }

        // Load projects (in a real app, you would filter by user's projects)
        const projects = [];
        for (let i = 0; i < projectCount.toNumber(); i++) {
          const project = await getProjectInfo(provider, i);
          if (project) {
            if (project.status === 1) { // Active
              setActiveProjects(prev => [...prev, project]);
            } else if (project.status === 2) { // Completed
              setCompletedProjects(prev => [...prev, project]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [provider, account]);

  const ProjectCard = ({ project }) => (
    <Box
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
        <Text color="gray.600" noOfLines={2}>
          {project.description}
        </Text>
        <HStack justify="space-between">
          <Badge colorScheme={project.status === 1 ? 'green' : 'blue'}>
            {project.status === 1 ? 'Active' : 'Completed'}
          </Badge>
          <Text fontWeight="bold">
            {project.budget} ETH
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          Deadline: {project.deadline.toLocaleDateString()}
        </Text>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => router.push(`/projects/${project.id}`)}
        >
          View Details
        </Button>
      </VStack>
    </Box>
  );

  return (
    <>
      <Navigation account={account} />
      <Container maxW="container.xl" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl">
            Dashboard
          </Heading>

          {talentStats && (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Stat>
                <StatLabel>Total Projects</StatLabel>
                <StatNumber>{talentStats.projectCount}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Rating</StatLabel>
                <StatNumber>{talentStats.rating}/5</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  9.05%
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Experience</StatLabel>
                <StatNumber>{talentStats.experience} years</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  1 year
                </StatHelpText>
              </Stat>
            </SimpleGrid>
          )}

          <Tabs variant="enclosed">
            <TabList>
              <Tab>Active Projects</Tab>
              <Tab>Completed Projects</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {loading ? (
                  <Text>Loading active projects...</Text>
                ) : activeProjects.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {activeProjects.map((project, index) => (
                      <ProjectCard key={index} project={project} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>No active projects found.</Text>
                )}
              </TabPanel>

              <TabPanel>
                {loading ? (
                  <Text>Loading completed projects...</Text>
                ) : completedProjects.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {completedProjects.map((project, index) => (
                      <ProjectCard key={index} project={project} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>No completed projects found.</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </>
  );
};

export default Dashboard; 