var HDWalletProvider = require("truffle-hdwallet-provider");
const dotenv = require("dotenv");
dotenv.config();

FROM_ADDRESS = process.env.FROM_ADDRESS;
PRIVATE_KEY = process.env.PRIVATE_KEY;
MAINNET_URL = process.env.MAINNET_URL;
GAS_LIMIT = process.env.GAS_LIMIT;
GAS_PRICE = process.env.GAS_PRICE;
Main_SEPOLIA = process.env.SEPOLIA;

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: "S4ZYNS4PEI2HHSFQ9YP29AISS2N14NGMBG",
  },
  contracts_directory: "./Token/contracts",
  migrations_directory: "./Token/migrations",
  contracts_build_directory: "./build",
  test_directory: "./Token/test",
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //   host: "127.0.0.1", // Localhost (default: none)
    //   port: 9545, // Standard Ethereum port (default: none)
    //   network_id: "5777", // Any network (default: none)
    // },
    ganache: {
      provider: () => {
        return new HDWalletProvider([PRIVATE_KEY], MAINNET_URL);
      },
      network_id: "5777",
      gas: GAS_LIMIT, //make sure this gas allocation isn't over 4M, which is the max
      from: FROM_ADDRESS,
      gasPrice: GAS_PRICE,
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider([PRIVATE_KEY], MAINNET_URL);
      },
      network_id: "3",
      gas: GAS_LIMIT, //make sure this gas allocation isn't over 4M, which is the max
      from: FROM_ADDRESS,
      gasPrice: GAS_PRICE,
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider([PRIVATE_KEY], MAINNET_URL);
      },
      network_id: "4",
      gas: GAS_LIMIT, //make sure this gas allocation isn't over 4M, which is the max
      from: FROM_ADDRESS,
      gasPrice: GAS_PRICE,
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider([PRIVATE_KEY], MAINNET_URL);
      },
      network_id: "5",
      gas: GAS_LIMIT, //make sure this gas allocation isn't over 4M, which is the max
      from: FROM_ADDRESS,
      // gasPrice: GAS_PRICE,
      skipDryRun: true,
      networkCheckTimeout: 100000000,
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider([PRIVATE_KEY], MAINNET_URL);
      },
      network_id: "1",
      gas: GAS_LIMIT, //make sure this gas allocation isn't over 4M, which is the max
      from: FROM_ADDRESS,
      // gasPrice: GAS_PRICE,
      networkCheckTimeout: 100000000,
    },
    sepolia: {
      provider: () => {
        return new HDWalletProvider([PRIVATE_KEY], Main_SEPOLIA);
      },
      network_id: "11155111",
      //gas: GAS_LIMIT, //make sure this gas allocation isn't over 4M, which is the max
      from: FROM_ADDRESS,
      //gasPrice: GAS_PRICE,
      skipDryRun: true,
      networkCheckTimeout: 100000000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
