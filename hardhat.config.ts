import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: [
        {
          privateKey: process.env.ADMIN_PRIVATE_KEY!,
          balance: "10000000000000000000000",
        },
        {
          privateKey: process.env.CLIENT_PRIVATE_KEY!,
          balance: "10000000000000000000000",
        },
      ],
    },
    hederatestnet: {
      url: "https://testnet.hashio.io/api",
      accounts: [
        "8918087e7e85b1df077383d1b1215dc4c46f1427bfd77d245ba3b9724a165f1c",
      ],
    },
  },
};

export default config;
