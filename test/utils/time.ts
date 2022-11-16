import { ethers } from "hardhat"
import { BigNumber } from "ethers"

async function latest() {
  const block = await ethers.provider.getBlock("latest")
  return BigNumber.from(block.timestamp)
}

const duration = {
  seconds: function (val: any) {
    return BigNumber.from(val)
  },
  minutes: function (val: any) {
    return BigNumber.from(val).mul(this.seconds("60"))
  },
  hours: function (val: any) {
    return BigNumber.from(val).mul(this.minutes("60"))
  },
  days: function (val: any) {
    return BigNumber.from(val).mul(this.hours("24"))
  },
  weeks: function (val: any) {
    return BigNumber.from(val).mul(this.days("7"))
  },
  years: function (val: any) {
    return BigNumber.from(val).mul(this.days("365"))
  },
}

export { latest, duration }
