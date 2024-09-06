import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

export const ADMIN_ADDRESS = "0x8bEBb95f8B9808198eAaA79eA92e35E854B60F87";
export const CLIENT_ADDRESS = "0x3F233a18310c563270C3f8C6E9759b5f32FF4E08";

const Vroombuddy = buildModule("Vroombuddy", (m) => {
  const owner = m.getAccount(0);
  const initialSupply = ethers.parseUnits("1000000", 6);
  const initialFund = ethers.parseUnits("500000", 6);
  const usdc = m.contract("USDC", [owner, initialSupply]);
  m.call(usdc, "mint", [ADMIN_ADDRESS, initialSupply], {
    id: "mint_usdc_admin",
  });
  m.call(usdc, "mint", [CLIENT_ADDRESS, initialSupply], {
    id: "mint_usdc_client",
  });

  const vroombuddy = m.contract("Vroombuddy", [owner, usdc]);

  m.call(usdc, "approve", [vroombuddy, initialFund]);
  m.call(vroombuddy, "addFund", [initialFund], {
    id: "fund_vroombuddy",
  });

  return { vroombuddy, usdc };
});

export default Vroombuddy;

// npx hardhat ignition deploy ./ignition/modules/Vroombuddy.ts --network hardhat
// npx hardhat ignition deploy ./ignition/modules/Vroombuddy.ts --network hederatestnet
