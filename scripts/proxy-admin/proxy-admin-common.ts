import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { sleep } from "../utils"

export const PROXY_ADMIN_ABI = [
  "function owner() external view returns (address)",
  "function upgrade(address proxy,address implementation) external",
  "function transferOwnership(address newOwner) public",
]

export const PROXY_ADMIN_SLOT = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"

export async function transferProxyAdminOwnerShip(
  signer: SignerWithAddress,
  proxyAdminAddress: string,
  newOwnerAddress: string
) {
  if (proxyAdminAddress.length === 0) {
    throw new Error("proxyAdminAddress is empty")
  }
  if (newOwnerAddress.length === 0) {
    throw new Error("newOwnerAddress is empty")
  }

  // check sum
  proxyAdminAddress = ethers.utils.getAddress(proxyAdminAddress)
  newOwnerAddress = ethers.utils.getAddress(newOwnerAddress)

  console.log("currentUser:", signer.address)

  const { proxyAdminContract, proxyAdminOwner } = await getProxyAdmin(proxyAdminAddress)

  console.log(`Transferring proxyAdminOwnerShip to ${newOwnerAddress}`)

  await proxyAdminContract.transferOwnership(newOwnerAddress)

  console.log(`Done, old owner is ${proxyAdminOwner}, new owner is ${newOwnerAddress}`)
}

export async function getProxyAdmin(proxyAdminAddress: string) {
  const proxyAdminContract = await ethers.getContractAt(PROXY_ADMIN_ABI, proxyAdminAddress)
  const proxyAdminOwner = await proxyAdminContract.owner()

  console.log(`ProxyAdmin Contract Owner: ${proxyAdminOwner}`)
  return { proxyAdminContract, proxyAdminOwner }
}

export async function upgrade(needToUpgradeAddr: string, newImpContractName: string) {
  const signers = await ethers.getSigners()
  const currentUser = signers[0]
  console.log("currentUser:", currentUser.address)

  // check sum
  needToUpgradeAddr = ethers.utils.getAddress(needToUpgradeAddr)

  const proxyAdminAddress =
    "0x" + (await ethers.provider.getStorageAt(needToUpgradeAddr, PROXY_ADMIN_SLOT)).substring(26)

  console.log(`ProxyAdmin Contract Addr: ${proxyAdminAddress}`)

  const { proxyAdminContract, proxyAdminOwner } = await getProxyAdmin(proxyAdminAddress)

  if (ethers.utils.getAddress(proxyAdminOwner) !== ethers.utils.getAddress(currentUser.address)) {
    throw new Error(`Bad Signer, should use ${proxyAdminOwner}`)
  }

  const Factory = await ethers.getContractFactory(newImpContractName)
  const newImpl = await Factory.deploy()
  await sleep(6000)

  await proxyAdminContract.upgrade(needToUpgradeAddr, newImpl.address)
  console.log(
    `${newImpContractName} Contract ${needToUpgradeAddr} success updated to new ${newImpContractName} impl ${newImpl.address}`
  )
}
