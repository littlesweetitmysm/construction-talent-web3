# Construction Talent Web3 Platform

A decentralized platform for managing construction talent and projects using Web3 technology.

## Features

- Talent Registration and Verification
- Project Creation and Management
- Smart Contract-based Project Assignment
- Rating System for Completed Projects
- Profile Management for Talents
- Dashboard for Project Tracking

## Tech Stack

- **Frontend**: Next.js, Chakra UI
- **Smart Contracts**: Solidity, Hardhat
- **Web3**: ethers.js
- **Testing**: Chai, Mocha

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or other Web3 wallet
- Hardhat

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/littlesweetitmysm/construction-talent-web3.git
   cd construction-talent-web3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
   PRIVATE_KEY=your_private_key
   ```

4. Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Smart Contract Deployment

1. Deploy to local network:
   ```bash
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```

2. Deploy to testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network goerli
   ```

## Testing

Run the test suite:
```bash
npx hardhat test
```

## Project Structure

```
construction-talent-web3/
├── contracts/              # Smart contracts
├── scripts/               # Deployment scripts
├── src/
│   ├── components/        # React components
│   ├── pages/            # Next.js pages
│   └── utils/            # Utility functions
├── test/                 # Test files
└── hardhat.config.js     # Hardhat configuration
```

## Smart Contract Functions

### Talent Management
- `registerTalent`: Register a new talent
- `verifyTalent`: Verify a talent's credentials
- `getTalentInfo`: Get talent information

### Project Management
- `createProject`: Create a new project
- `assignProject`: Assign a project to a talent
- `getProjectInfo`: Get project information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/littlesweetitmysm/construction-talent-web3](https://github.com/littlesweetitmysm/construction-talent-web3) 