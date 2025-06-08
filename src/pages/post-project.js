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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
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
    requiredSkills: '',
  });

  const router = useRouter();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
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

      const requiredSkillsArray = project.requiredSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const tx = await contract.createProject(
        project.title,
        project.description,
        ethers.utils.parseEther(project.budget),
        requiredSkillsArray,
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
                  <FormLabel color={textColor}>Required Skills (comma separated)</FormLabel>
                  <Input
                    name="requiredSkills"
                    value={project.requiredSkills}
                    onChange={handleChange}
                    placeholder="e.g. Plumbing, Electrical, Carpentry"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                  />
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