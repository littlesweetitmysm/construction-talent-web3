// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ConstructionTalent is Ownable, ReentrancyGuard {
    struct Talent {
        string name;
        string skills;
        uint256 experience;
        bool isVerified;
        uint256[] certifications;
        uint256 rating;
        uint256 projectCount;
    }

    struct Project {
        string title;
        string description;
        uint256 budget;
        address client;
        bool isActive;
        uint256[] requiredSkills;
        uint256 deadline;
    }

    mapping(address => Talent) public talents;
    mapping(uint256 => Project) public projects;
    uint256 public projectCount;
    
    event TalentRegistered(address indexed talent, string name);
    event ProjectCreated(uint256 indexed projectId, string title);
    event TalentVerified(address indexed talent);
    event ProjectAssigned(uint256 indexed projectId, address indexed talent);

    constructor() {}

    function registerTalent(
        string memory _name,
        string memory _skills,
        uint256 _experience
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_skills).length > 0, "Skills cannot be empty");
        
        talents[msg.sender] = Talent({
            name: _name,
            skills: _skills,
            experience: _experience,
            isVerified: false,
            certifications: new uint256[](0),
            rating: 0,
            projectCount: 0
        });

        emit TalentRegistered(msg.sender, _name);
    }

    function createProject(
        string memory _title,
        string memory _description,
        uint256 _budget,
        uint256[] memory _requiredSkills,
        uint256 _deadline
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_budget > 0, "Budget must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        projectCount++;
        uint256 currentProjectId = projectCount;
        projects[currentProjectId] = Project({
            title: _title,
            description: _description,
            budget: _budget,
            client: msg.sender,
            isActive: true,
            requiredSkills: _requiredSkills,
            deadline: _deadline
        });

        emit ProjectCreated(currentProjectId, _title);
    }

    function verifyTalent(address _talent) external onlyOwner {
        require(talents[_talent].experience > 0, "Talent not registered");
        talents[_talent].isVerified = true;
        emit TalentVerified(_talent);
    }

    function assignProject(uint256 _projectId, address _talent) external {
        require(projects[_projectId].isActive, "Project is not active");
        require(talents[_talent].isVerified, "Talent is not verified");
        require(projects[_projectId].client == msg.sender, "Only project client can assign");

        talents[_talent].projectCount++;
        projects[_projectId].isActive = false;

        emit ProjectAssigned(_projectId, _talent);
    }

    function getTalentInfo(address _talent) external view returns (
        string memory name,
        string memory skills,
        uint256 experience,
        bool isVerified,
        uint256 rating,
        uint256 projectCount
    ) {
        Talent storage talent = talents[_talent];
        return (
            talent.name,
            talent.skills,
            talent.experience,
            talent.isVerified,
            talent.rating,
            talent.projectCount
        );
    }

    function getProjectInfo(uint256 _projectId) external view returns (
        string memory title,
        string memory description,
        uint256 budget,
        address client,
        bool isActive,
        uint256 deadline
    ) {
        Project storage project = projects[_projectId];
        return (
            project.title,
            project.description,
            project.budget,
            project.client,
            project.isActive,
            project.deadline
        );
    }
} 