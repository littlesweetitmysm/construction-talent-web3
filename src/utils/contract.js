import { ethers } from 'ethers';
import ConstructionTalent from '../artifacts/contracts/ConstructionTalent.sol/ConstructionTalent.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const getContract = (provider) => {
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ConstructionTalent.abi,
    provider
  );
};

export const getContractWithSigner = (signer) => {
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ConstructionTalent.abi,
    signer
  );
};

export const registerTalent = async (signer, name, skills, experience, certifications) => {
  const contract = getContractWithSigner(signer);
  return contract.registerTalent(name, skills, experience, certifications);
};

export const getTalentInfo = async (provider, address) => {
  const contract = getContract(provider);
  try {
    const talent = await contract.talents(address);
    return {
      name: talent.name,
      skills: talent.skills,
      experience: talent.experience.toNumber(),
      certifications: talent.certifications,
      isVerified: talent.isVerified,
      projectCount: talent.projectCount.toNumber(),
      rating: talent.rating.toNumber() / 100, // Convert from basis points
    };
  } catch (error) {
    console.error('Error fetching talent info:', error);
    return null;
  }
};

export const createProject = async (signer, title, description, budget, requiredSkills, deadline) => {
  const contract = getContractWithSigner(signer);
  return contract.createProject(
    title,
    description,
    ethers.utils.parseEther(budget.toString()),
    requiredSkills,
    Math.floor(deadline.getTime() / 1000)
  );
};

export const getProjectInfo = async (provider, projectId) => {
  const contract = getContract(provider);
  try {
    const project = await contract.projects(projectId);
    return {
      title: project.title,
      description: project.description,
      budget: ethers.utils.formatEther(project.budget),
      requiredSkills: project.requiredSkills,
      deadline: new Date(project.deadline.toNumber() * 1000),
      status: project.status,
      assignedTalent: project.assignedTalent,
    };
  } catch (error) {
    console.error('Error fetching project info:', error);
    return null;
  }
};

export const verifyTalent = async (signer, talentAddress) => {
  const contract = getContractWithSigner(signer);
  return contract.verifyTalent(talentAddress);
};

export const assignProject = async (signer, projectId, talentAddress) => {
  const contract = getContractWithSigner(signer);
  return contract.assignProject(projectId, talentAddress);
};

export const getProjectCount = async (provider) => {
  const contract = getContract(provider);
  return contract.getProjectCount();
};

export const getTalentCount = async (provider) => {
  const contract = getContract(provider);
  return contract.getTalentCount();
};

export const getAllTalents = async (contract) => {
  try {
    // Method 1: Check for talent registration events
    const filter = contract.filters.TalentRegistered();
    const events = await contract.queryFilter(filter);
    
    const talentAddresses = events.map(event => event.args.talentAddress);
    const talents = [];
    
    for (const address of talentAddresses) {
      try {
        const talentInfo = await contract.getTalentInfo(address);
        const [name, gender, birthday, physicalAddress, governmentId, career, certifications, isVerified, rating, projectCount] = talentInfo;
        
        if (name && name.length > 0) {
          talents.push({
            address,
            name,
            gender,
            birthday,
            physicalAddress,
            governmentId,
            career,
            certifications: certifications || [],
            isVerified,
            rating: Number(rating),
            projectCount: Number(projectCount),
          });
        }
      } catch (error) {
        console.log(`Error fetching talent info for ${address}:`, error);
      }
    }
    
    return talents;
  } catch (error) {
    console.error('Error fetching all talents:', error);
    return [];
  }
};

export const getTalentByAddress = async (contract, address) => {
  try {
    const talentInfo = await contract.getTalentInfo(address);
    const [name, gender, birthday, physicalAddress, governmentId, career, certifications, isVerified, rating, projectCount] = talentInfo;
    
    if (name && name.length > 0) {
      return {
        address,
        name,
        gender,
        birthday,
        physicalAddress,
        governmentId,
        career,
        certifications: certifications || [],
        isVerified,
        rating: Number(rating),
        projectCount: Number(projectCount),
        // Additional fields from localStorage
        additionalSkills: localStorage.getItem(`talent_${address}_skills`) || '',
        additionalCertifications: localStorage.getItem(`talent_${address}_additionalCerts`) || '',
        experience: localStorage.getItem(`talent_${address}_experience`) || '',
        portfolio: localStorage.getItem(`talent_${address}_portfolio`) || '',
        references: localStorage.getItem(`talent_${address}_references`) || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching talent by address:', error);
    return null;
  }
}; 