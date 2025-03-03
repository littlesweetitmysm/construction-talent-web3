const hre = require("hardhat");

async function main() {
  console.log("Deploying ConstructionTalent contract...");

  const ConstructionTalent = await hre.ethers.getContractFactory("ConstructionTalent");
  const constructionTalent = await ConstructionTalent.deploy();

  await constructionTalent.deployed();

  console.log("ConstructionTalent deployed to:", constructionTalent.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 