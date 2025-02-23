import { ethers } from 'ethers';
import ConstructionTalent from '../../artifacts/contracts/ConstructionTalent.sol/ConstructionTalent.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getContract = async (signerOrProvider) => {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ConstructionTalent.abi,
    signerOrProvider
  );
  return contract;
};

export const registerTalent = async (signer, name, skills, experience) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.registerTalent(name, skills, experience);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error registering talent:', error);
    throw error;
  }
};

export const createProject = async (signer, title, description, budget, requiredSkills, deadline) => {
  try {
    const contract = await getContract(signer);
    const tx = await contract.createProject(title, description, budget, requiredSkills, deadline);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getTalentInfo = async (provider, address) => {
  try {
    const contract = await getContract(provider);
    const talentInfo = await contract.getTalentInfo(address);
    return talentInfo;
  } catch (error) {
    console.error('Error getting talent info:', error);
    throw error;
  }
};

export const getProjectInfo = async (provider, projectId) => {
  try {
    const contract = await getContract(provider);
    const projectInfo = await contract.getProjectInfo(projectId);
    return projectInfo;
  } catch (error) {
    console.error('Error getting project info:', error);
    throw error;
  }
}; 