import { ethers } from "hardhat";

async function main() {
  const addr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const saveToken = await ethers.deployContract("SaveERC20", [addr], {});

  await saveToken.waitForDeployment();

  console.log(`SaveERC20 deployed to ${saveToken.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
