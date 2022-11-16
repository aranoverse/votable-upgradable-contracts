// eslint-disable-next-line node/no-missing-import
import { transferProxyAdminOwnerShip } from "./proxy-admin-common"
import { ethers } from "hardhat"

const proxyAdminAddress = "0x29573cf5cd461001fbeC0Fc91efb1b027F59099f"
const newProxyAdminOwner = ""
async function main() {
  const singers = await ethers.getSigners()
  await transferProxyAdminOwnerShip(singers[0], proxyAdminAddress, newProxyAdminOwner)
}

main().catch((error: any) => {
  console.error(error)
  process.exitCode = 1
})
