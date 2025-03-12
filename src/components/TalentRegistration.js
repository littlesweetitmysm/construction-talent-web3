import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { registerTalent } from '../utils/contract';

const TalentRegistration = ({ isOpen, onClose, signer }) => {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: '',
    certifications: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tx = await registerTalent(
        signer,
        formData.name,
        formData.skills,
        parseInt(formData.experience),
        formData.certifications
      );
      await tx.wait();

      toast({
        title: 'Success',
        description: 'Talent registration successful!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      setFormData({
        name: '',
        skills: '',
        experience: '',
        certifications: '',
      });
    } catch (error) {
      console.error('Error registering talent:', error);
      toast({
        title: 'Error',
        description: 'Failed to register talent. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register as Talent</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
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
                  placeholder="Enter your skills (comma-separated)"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Years of Experience</FormLabel>
                <Input
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  min="0"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Certifications</FormLabel>
                <Textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="Enter your certifications (comma-separated)"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              loadingText="Registering..."
            >
              Register
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default TalentRegistration; 