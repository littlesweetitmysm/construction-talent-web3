import { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import ConstructionTalent from '../contracts/ConstructionTalent.json';

const TalentRegistration = ({ provider, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: 0,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Debug logging
    console.log('TalentRegistration Submit:', formData);
    setLoading(true);

    try {
      const signer = provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(
        contractAddress,
        ConstructionTalent.abi,
        signer
      );

      const tx = await contract.registerTalent(
        formData.name,
        formData.skills,
        formData.experience
      );

      await tx.wait();

      toast({
        title: 'Registration Successful',
        description: 'Your talent profile has been created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error registering talent:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to register talent profile.',
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

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="sm">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Skills</FormLabel>
            <Textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter your skills (e.g., Carpentry, Electrical, Plumbing)"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Years of Experience</FormLabel>
            <NumberInput
              min={0}
              value={formData.experience}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, experience: value }))
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Registering..."
          >
            Register as Talent
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TalentRegistration; 