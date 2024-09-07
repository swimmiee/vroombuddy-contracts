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
      url: "https://testnet.hedera.validationcloud.io/v1/_EqqzNHjyYRuykKsXaRkpnM1D8kcLkBneV0A_HhgAh0",
      accounts: [
        process.env.ADMIN_PRIVATE_KEY!,
        process.env.CLIENT_PRIVATE_KEY!,
      ],
    },
  },
};

export default config;
