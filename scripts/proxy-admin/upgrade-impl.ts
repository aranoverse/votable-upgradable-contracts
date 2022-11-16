// eslint-disable-next-line node/no-missing-import
import { upgrade } from "./proxy-admin-common"

const needToUpgradeAddr = ""
const newImpContractName = "DEX"

async function main() {
  await upgrade(needToUpgradeAddr, newImpContractName)
}

main().catch((error: any) => {
  console.error(error)
  process.exitCode = 1
})
