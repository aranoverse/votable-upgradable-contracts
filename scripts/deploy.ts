import { ethers, upgrades } from "hardhat";
import { upgrade } from "./proxy-admin/proxy-admin-common";

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;
  //
  // const lockedAmount = ethers.utils.parseEther("1");
  //
  // const Lock = await ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  //
  // await lock.deployed();
  //
  // console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`);

  const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const VotableProxyAdmin = await ethers.getContractFactory("VotableProxyAdmin");
  const MockProposerRegistry = await ethers.getContractFactory("MockProposerRegistry");
  const registry = await MockProposerRegistry.deploy();

  // await registry.grantProposer();



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
