import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  useColorModeValue,
  Select,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const RegisterTalent = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    physicalAddress: '',
    governmentId: '',
    career: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to register');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        signer
      );

      // Convert birthday to timestamp
      const birthdayTimestamp = Math.floor(new Date(formData.birthday).getTime() / 1000);

      const tx = await contract.registerTalent(
        formData.name,
        formData.gender,
        birthdayTimestamp,
        formData.physicalAddress,
        formData.governmentId,
        formData.career
      );

      await tx.wait();

      toast({
        title: 'Registration Successful',
        description: 'Your talent profile has been created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/profile');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to register talent profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navigation />
      <Container maxW="container.md" pt={20}>
        <VStack
          spacing={8}
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          w="full"
        >
          <Heading size="xl" textAlign="center" color="blue.500">
            Register as a Talent
          </Heading>
          <Text textAlign="center" color="gray.500">
            Fill in your details to create your talent profile
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  placeholder="Select gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Birthday</FormLabel>
                <Input
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Physical Address</FormLabel>
                <Textarea
                  name="physicalAddress"
                  value={formData.physicalAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your physical address"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Government ID</FormLabel>
                <Input
                  name="governmentId"
                  value={formData.governmentId}
                  onChange={handleInputChange}
                  placeholder="Enter your government ID number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Career</FormLabel>
                <Textarea
                  name="career"
                  value={formData.career}
                  onChange={handleInputChange}
                  placeholder="Describe your career and experience"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={loading}
                loadingText="Registering..."
              >
                Register as Talent
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default RegisterTalent; 