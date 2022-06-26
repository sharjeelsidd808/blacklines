require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    skale: {
      url: process.env.SKALE_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};

