import { mine } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

async function mining(){
    await mine(1);

    const account = await ethers.getSigners();
  const ADMIN_ADDRESS = account[0];
  await ADMIN_ADDRESS.sendTransaction({
    to: "0x3d92d355000a52AB728205e99f572780F4cAB003",
    value: ethers.parseEther("10"),
  });
}

mining();

// npx hardhat run ./ignition/modules/mine.ts --network localhost