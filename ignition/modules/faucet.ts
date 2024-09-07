import { ethers } from "hardhat";

const contracts = {
  local: {
    usdc: "0x9A2CE31DF0f8c21b35EFDfBb9D783A146fe11Ba3",
    vroombuddy: "0x71DBC289F9840B9b83Be8E268652dc1C406C9971",
  },
};

async function faucet() {
  const account = await ethers.getSigners();
  const ADMIN_ADDRESS = account[0];
  const CLIENT_ADDRESS = account[1];

  const env = contracts.local;

  console.log("Admin address: ", ADMIN_ADDRESS.address);
  console.log("Client address: ", CLIENT_ADDRESS.address);

  const USDC = await ethers.getContractAt("USDC", env.usdc);
  const adminBal = await USDC.balanceOf(ADMIN_ADDRESS.address);
  const clientBal = await USDC.balanceOf(CLIENT_ADDRESS.address);
  const vroomBal = await USDC.balanceOf(env.vroombuddy);

  const Vroombuddy = await ethers.getContractAt("Vroombuddy", env.vroombuddy);

  console.log("Admin USDC balance: ", ethers.formatUnits(adminBal, 6));
  console.log("Client USDC balance: ", ethers.formatUnits(clientBal, 6));
  console.log("Vroombuddy USDC balance: ", ethers.formatUnits(vroomBal, 6));

  console.log(ADMIN_ADDRESS.address === (await Vroombuddy.owner()));

  console.log(await Vroombuddy.policyHolders("0x3d92d355000a52AB728205e99f572780F4cAB003"));

    // await Vroombuddy.allowClaim("0x3d92d355000a52AB728205e99f572780F4cAB003", ethers.parseUnits("100", 6));
}

faucet();
// npx hardhat run ./ignition/modules/faucet.ts --network localhost
