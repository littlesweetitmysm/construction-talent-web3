import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { registerTalent } from '../utils/contract';

const TalentRegistration = ({ signer }) => {
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerTalent(signer, name, skills, experience);
      toast({
        title: 'Registration Successful',
        description: 'Your talent profile has been created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Reset form
      setName('');
      setSkills('');
      setExperience(0);
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Skills</FormLabel>
          <Textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="List your construction skills (e.g., Electrical, Plumbing, Carpentry)"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Years of Experience</FormLabel>
          <NumberInput
            min={0}
            max={50}
            value={experience}
            onChange={(value) => setExperience(value)}
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
          size="lg"
          width="full"
          isLoading={isLoading}
          loadingText="Registering..."
        >
          Register as Talent
        </Button>
      </VStack>
    </Box>
  );
};

export default TalentRegistration; 