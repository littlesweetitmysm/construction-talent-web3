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
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';
import Navigation from '../components/Navigation';

export default function RegisterTalent() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    physicalAddress: '',
    governmentId: '',
    career: '',
    certifications: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ConstructionTalent.abi,
        signer
      );

      const tx = await contract.registerTalent(
        formData.name,
        formData.gender,
        formData.birthday,
        formData.physicalAddress,
        formData.governmentId,
        formData.career,
        formData.certifications
      );

      await tx.wait();

      toast({
        title: 'Registration successful!',
        description: 'Your talent profile has been created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/profile');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'There was an error registering your profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');

  // Overlay logic
  const overlay = useColorModeValue(
    'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.85))',
    'linear-gradient(to bottom, rgba(10,10,30,0.85), rgba(0,0,0,0.92))'
  );
  const bgImage = useColorModeValue(
    "url('/images/cityscape-bg.jpg')",
    "url('/images/cityscape-bg.jpg')"
  );

  return (
    <Box
      minH="100vh"
      position="relative"
      bgImage={bgImage}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      _after={{
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: overlay,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Navigation />
      <Container maxW="container.md" pt={20} pb={10}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" color={textColor} textAlign="center">
            Register as a Talent
          </Heading>
          <Box
            p={8}
            bg={bgColor}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="lg"
          >
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} textAlign="center" pb={4}>
              Fill in your details to create your talent profile
            </Text>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="Select gender"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Physical Address</FormLabel>
                  <Textarea
                    name="physicalAddress"
                    value={formData.physicalAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your physical address"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Government ID</FormLabel>
                  <Input
                    name="governmentId"
                    value={formData.governmentId}
                    onChange={handleInputChange}
                    placeholder="Enter your government ID number"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Career/Profession</FormLabel>
                  <Input
                    name="career"
                    value={formData.career}
                    onChange={handleInputChange}
                    placeholder="Enter your career or profession"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Certifications</FormLabel>
                  <Textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="List your relevant certifications"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Registering..."
                  bg={useColorModeValue('blue.600', 'blue.400')}
                  color="white"
                  _hover={{
                    bg: useColorModeValue('blue.700', 'blue.500'),
                  }}
                >
                  Register
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
} 