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
  Select,
} from '@chakra-ui/react';
import { createProject } from '../utils/contract';

const SKILLS = [
  'Electrical',
  'Plumbing',
  'Carpentry',
  'Masonry',
  'HVAC',
  'Painting',
  'Roofing',
  'General Construction',
];

const ProjectCreation = ({ signer }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(0);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Project title is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Project description is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!budget || parseFloat(budget) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid budget greater than 0.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!deadline) {
      toast({
        title: 'Validation Error',
        description: 'Please select a project deadline.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Check if deadline is in the future
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    if (deadlineDate <= currentDate) {
      toast({
        title: 'Validation Error',
        description: 'Deadline must be in the future.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!requiredSkills || requiredSkills.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one required skill.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      await createProject(signer, title, description, budget, requiredSkills, deadlineTimestamp);
      toast({
        title: 'Project Created',
        description: 'Your project has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setBudget(0);
      setRequiredSkills([]);
      setDeadline('');
    } catch (error) {
      toast({
        title: 'Project Creation Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
    setRequiredSkills(selectedSkills);
  };

  // Validation function to check if form is complete
  const isFormValid = () => {
    const titleValid = title.trim() !== '';
    const descriptionValid = description.trim() !== '';
    const budgetValid = budget && parseFloat(budget) > 0;
    
    // Check if deadline is not earlier than today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const deadlineDate = deadline ? new Date(deadline) : null;
    const deadlineValid = deadline && deadlineDate >= today;
    
    const skillsValid = requiredSkills.length > 0;

    // Debug logging
    console.log('Project Creation Validation:', {
      title: titleValid,
      description: descriptionValid,
      budget: budgetValid,
      deadline: deadlineValid,
      skills: skillsValid,
      requiredSkillsArray: requiredSkills,
      requiredSkillsLength: requiredSkills.length
    });

    return titleValid && descriptionValid && budgetValid && deadlineValid && skillsValid;
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Project Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Project Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project requirements"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Budget (ETH)</FormLabel>
          <NumberInput
            min={0}
            precision={4}
            value={budget}
            onChange={(value) => setBudget(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Required Skills</FormLabel>
          <Select
            multiple
            value={requiredSkills}
            onChange={handleSkillChange}
            placeholder="Select required skills"
          >
            {SKILLS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Project Deadline</FormLabel>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={isLoading}
          loadingText="Creating Project..."
          isDisabled={!isFormValid()}
        >
          Create Project
        </Button>
      </VStack>
    </Box>
  );
};

export default ProjectCreation; 