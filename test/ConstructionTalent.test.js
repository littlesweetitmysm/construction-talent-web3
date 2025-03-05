const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConstructionTalent", function () {
  let constructionTalent;
  let owner;
  let talent;
  let client;

  beforeEach(async function () {
    [owner, talent, client] = await ethers.getSigners();
    const ConstructionTalent = await ethers.getContractFactory("ConstructionTalent");
    constructionTalent = await ConstructionTalent.deploy();
    await constructionTalent.deployed();
  });

  describe("Talent Registration", function () {
    it("Should register a new talent", async function () {
      const name = "John Doe";
      const skills = "Electrical, Plumbing";
      const experience = 5;

      await constructionTalent.connect(talent).registerTalent(name, skills, experience);
      const talentInfo = await constructionTalent.getTalentInfo(talent.address);

      expect(talentInfo.name).to.equal(name);
      expect(talentInfo.skills).to.equal(skills);
      expect(talentInfo.experience).to.equal(experience);
      expect(talentInfo.isVerified).to.equal(false);
    });

    it("Should not allow empty name", async function () {
      await expect(
        constructionTalent.connect(talent).registerTalent("", "Skills", 5)
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("Should not allow empty skills", async function () {
      await expect(
        constructionTalent.connect(talent).registerTalent("John Doe", "", 5)
      ).to.be.revertedWith("Skills cannot be empty");
    });
  });

  describe("Project Creation", function () {
    it("Should create a new project", async function () {
      const title = "House Renovation";
      const description = "Complete house renovation project";
      const budget = ethers.utils.parseEther("1.0");
      const requiredSkills = ["Electrical", "Plumbing"];
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

      await constructionTalent.connect(client).createProject(
        title,
        description,
        budget,
        requiredSkills,
        deadline
      );

      const projectInfo = await constructionTalent.getProjectInfo(1);
      expect(projectInfo.title).to.equal(title);
      expect(projectInfo.description).to.equal(description);
      expect(projectInfo.budget).to.equal(budget);
      expect(projectInfo.client).to.equal(client.address);
      expect(projectInfo.isActive).to.equal(true);
    });

    it("Should not allow empty title", async function () {
      await expect(
        constructionTalent.connect(client).createProject(
          "",
          "Description",
          ethers.utils.parseEther("1.0"),
          ["Electrical"],
          Math.floor(Date.now() / 1000) + 86400
        )
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should not allow zero budget", async function () {
      await expect(
        constructionTalent.connect(client).createProject(
          "Title",
          "Description",
          0,
          ["Electrical"],
          Math.floor(Date.now() / 1000) + 86400
        )
      ).to.be.revertedWith("Budget must be greater than 0");
    });

    it("Should not allow past deadline", async function () {
      await expect(
        constructionTalent.connect(client).createProject(
          "Title",
          "Description",
          ethers.utils.parseEther("1.0"),
          ["Electrical"],
          Math.floor(Date.now() / 1000) - 86400
        )
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("Talent Verification", function () {
    it("Should verify a talent", async function () {
      await constructionTalent.connect(talent).registerTalent("John Doe", "Skills", 5);
      await constructionTalent.connect(owner).verifyTalent(talent.address);
      
      const talentInfo = await constructionTalent.getTalentInfo(talent.address);
      expect(talentInfo.isVerified).to.equal(true);
    });

    it("Should not allow non-owner to verify talent", async function () {
      await constructionTalent.connect(talent).registerTalent("John Doe", "Skills", 5);
      await expect(
        constructionTalent.connect(client).verifyTalent(talent.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Project Assignment", function () {
    it("Should assign a project to a verified talent", async function () {
      // Register and verify talent
      await constructionTalent.connect(talent).registerTalent("John Doe", "Skills", 5);
      await constructionTalent.connect(owner).verifyTalent(talent.address);

      // Create project
      await constructionTalent.connect(client).createProject(
        "Title",
        "Description",
        ethers.utils.parseEther("1.0"),
        ["Electrical"],
        Math.floor(Date.now() / 1000) + 86400
      );

      // Assign project
      await constructionTalent.connect(client).assignProject(1, talent.address);

      const projectInfo = await constructionTalent.getProjectInfo(1);
      expect(projectInfo.isActive).to.equal(false);

      const talentInfo = await constructionTalent.getTalentInfo(talent.address);
      expect(talentInfo.projectCount).to.equal(1);
    });

    it("Should not allow assignment to unverified talent", async function () {
      await constructionTalent.connect(talent).registerTalent("John Doe", "Skills", 5);
      await constructionTalent.connect(client).createProject(
        "Title",
        "Description",
        ethers.utils.parseEther("1.0"),
        ["Electrical"],
        Math.floor(Date.now() / 1000) + 86400
      );

      await expect(
        constructionTalent.connect(client).assignProject(1, talent.address)
      ).to.be.revertedWith("Talent is not verified");
    });
  });
}); 