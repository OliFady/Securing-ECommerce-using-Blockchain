require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    polygon_mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/h_NStKMsZ5wMGDPIp6CJiBfMtsImTNa2",
      accounts:[`0x${"df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"}`],
    }
  }
};
