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

      // Convert certifications to string[]
      const certificationsArray = formData.certifications
        .split(',')
        .map(cert => cert.trim())
        .filter(cert => cert.length > 0);

      const tx = await contract.registerTalent(
        formData.name,
        formData.gender,
        formData.birthday,
        formData.physicalAddress,
        formData.governmentId,
        formData.career,
        certificationsArray
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

  return (
    <Box minH="100vh">
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
                  <Select
                    name="career"
                    value={formData.career}
                    onChange={handleInputChange}
                    placeholder="Select your career or profession"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                  >
                    <option value="Carpenter">Carpenter</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Mason">Mason</option>
                    <option value="Welder">Welder</option>
                    <option value="Painter">Painter</option>
                    <option value="HVAC Technician">HVAC Technician</option>
                    <option value="Roofing Specialist">Roofing Specialist</option>
                    <option value="Flooring Installer">Flooring Installer</option>
                    <option value="Concrete Worker">Concrete Worker</option>
                    <option value="Heavy Equipment Operator">Heavy Equipment Operator</option>
                    <option value="Safety Inspector">Safety Inspector</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Architect">Architect</option>
                    <option value="Civil Engineer">Civil Engineer</option>
                    <option value="Structural Engineer">Structural Engineer</option>
                    <option value="Mechanical Engineer">Mechanical Engineer</option>
                    <option value="Electrical Engineer">Electrical Engineer</option>
                    <option value="Landscaper">Landscaper</option>
                    <option value="Demolition Specialist">Demolition Specialist</option>
                    <option value="Scaffolding Specialist">Scaffolding Specialist</option>
                    <option value="Glass Installer">Glass Installer</option>
                    <option value="Insulation Specialist">Insulation Specialist</option>
                    <option value="Drywall Installer">Drywall Installer</option>
                    <option value="Tile Setter">Tile Setter</option>
                    <option value="Cabinet Maker">Cabinet Maker</option>
                    <option value="Millwright">Millwright</option>
                    <option value="Ironworker">Ironworker</option>
                    <option value="Sheet Metal Worker">Sheet Metal Worker</option>
                    <option value="Pipefitter">Pipefitter</option>
                    <option value="Boilermaker">Boilermaker</option>
                    <option value="Crane Operator">Crane Operator</option>
                    <option value="Surveyor">Surveyor</option>
                    <option value="Quality Control Inspector">Quality Control Inspector</option>
                    <option value="Estimator">Estimator</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Certifications (comma separated)</FormLabel>
                  <Textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="e.g. OSHA, PMP, LEED"
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