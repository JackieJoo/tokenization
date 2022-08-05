var SUPPT = artifacts.require('SUPPT.sol');
var TokenSale = artifacts.require('TokenSale.sol');
var KycContract = artifacts.require('KycContract.sol');
require('dotenv').config({path: '../.env'});
console.log('ENV:', process.env.INITIAL_TOKENS);

module.exports = async (deployer) => {
  const accs = await web3.eth.getAccounts();
  console.log(accs);
  await deployer.deploy(SUPPT, process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(TokenSale, 1, accs[0], SUPPT.address, KycContract.address);
  const instance = await SUPPT.deployed();
  instance.transfer(TokenSale.address, process.env.INITIAL_TOKENS);
}