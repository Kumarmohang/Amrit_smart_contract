const Token = artifacts.require("Token");
const fs = require("fs");
const tokenConfig = require("../../token_config.json");
const dotenv = require("dotenv");
/**
 * This migration file is used to deploy Token.sol file
 * @param {Object} deployer - deployer object
 */
module.exports = function (deployer) {
  // Section to change: start
  let tokenName = tokenConfig.tokenName;
  let tokenSymbol = tokenConfig.tokenSymbol;
  let totalSupply = tokenConfig.totalSupply;
  let ownerAddress = tokenConfig.ownerAddress;
  let treasuryWallet = tokenConfig.treasuryWallet;
  // Section to change: end

  deployer.deploy(
    Token,
    tokenName,
    tokenSymbol,
    totalSupply + "000000000000000000",
    ownerAddress,
    treasuryWallet
  );
};
