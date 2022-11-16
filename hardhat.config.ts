import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox"
import "@openzeppelin/hardhat-upgrades"
import * as dotenv from "dotenv"
import {ethers} from "ethers";

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    hardhat: {
      chainId: 1337,
    },

    goerli: {
      chainId: 5,
      url: "https://rpc.ankr.com/eth_goerli",
      accounts:
          process.env.PRIVATE_KEYS !== undefined
              ? process.env.PRIVATE_KEYS.toString().split(",")
              : [],
      gasPrice: ethers.utils.parseUnits("2", "gwei").toNumber(),
      gas: 2100_000,
    },
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    excludeContracts: ["mock/"],
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: { timeout: 9000000 },
};

export default config;
