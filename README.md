# Construction Talent Web3

A decentralized platform for managing construction industry talents and projects using Web3 technology.

## Features

- Smart contract-based talent and project management
- Decentralized profile verification
- Skill and certification system
- Project posting, filtering, and searching
- Public talent and project profiles (viewable by anyone)
- Profile and project update functions (additive, not destructive)
- Secure payment escrow system (planned)
- Modern UI with Next.js and Chakra UI

## Tech Stack

- Next.js (frontend)
- Hardhat (smart contract development)
- Solidity (smart contracts)
- Chakra UI (UI components)
- Web3Modal (wallet connection)
- Ethers.js (blockchain interaction)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/littlesweetitmysm/construction-talent-web3.git
cd construction-talent-web3
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the local blockchain (Hardhat node)

```bash
npx hardhat node
```

### 4. Deploy the smart contract

In a new terminal, run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

- Copy the deployed contract address from the output.

### 5. Create the `.env.local` file

Create a `.env.local` file in the root of `construction-talent-web3/` with the following content:

```
NEXT_PUBLIC_NETWORK_ID=1337
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_contract_address>
```

- Replace `<your_contract_address>` with the address you copied after deploying the contract.

### 6. Update the ABI (if you change the contract)

After compiling or deploying, copy the ABI to the frontend:

```bash
node scripts/copyAbi.js
```

### 7. Start the frontend

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Main Pages & Usage

- `/` — Home page
- `/projects` — Browse all projects (filter by skills, budget, status, etc.)
- `/post-project` — Post a new project (requires wallet connection)
- `/talents` — Browse all registered talents
- `/register-talent` — Register as a talent (requires wallet connection)
- `/profile` — View and update your own talent profile
- `/talent-profile?address=0x...` — View any talent's public profile by wallet address

## How to Use

- **Connect your wallet** (MetaMask or compatible) to register as a talent or post a project.
- **Register as a talent** on `/register-talent`.
- **Post a project** on `/post-project`.
- **Browse and filter** talents and projects on `/talents` and `/projects`.
- **View any user's profile** by clicking "View Profile" on the talents page or by visiting `/talent-profile?address=...`.
- **Update your profile** or projects with additional information (previous content is preserved).

## Wallet Requirements

- You need MetaMask or a compatible wallet extension installed in your browser.
- Make sure your wallet is connected to the local Hardhat network (chain ID 1337).

## Smart Contracts

- Contracts are in the `contracts/` directory.
- Use Hardhat for development, testing, and deployment.
- ABI is located in `src/contracts/ConstructionTalent.json` (copied via `scripts/copyAbi.js`).

## Frontend

- The frontend is in the `src/` directory.
- Uses Chakra UI for styling and components.
- All blockchain interactions use Ethers.js and Web3Modal.

## License

This project is proprietary software. See LICENSE file for details. 
