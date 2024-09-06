import { mine } from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function mining(){
    await mine(1);
}

mining();

// npx hardhat run ./ignition/modules/mine.ts --network localhost