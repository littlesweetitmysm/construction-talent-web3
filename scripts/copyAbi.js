const fs = require('fs');
const path = require('path');

// Create the contracts directory if it doesn't exist
const contractsDir = path.join(__dirname, '../src/contracts');
if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir, { recursive: true });
}

// Read the contract ABI from artifacts
const contractPath = path.join(__dirname, '../src/artifacts/contracts/ConstructionTalent.sol/ConstructionTalent.json');
const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

// Create the ABI file
const abiPath = path.join(contractsDir, 'ConstructionTalent.json');
fs.writeFileSync(abiPath, JSON.stringify({
  abi: contractData.abi,
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
}, null, 2));

console.log('Contract ABI copied successfully!'); 