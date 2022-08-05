require('dotenv').config({path: '../.env'});
const chai = require('./setupChai');
const bn = web3.utils.BN;

const Token = artifacts.require('SUPPT');
const TokenSale = artifacts.require('TokenSale');
const Kyc = artifacts.require('KycContract');

const expect = chai.expect;

contract('TokenSale Test', async (accounts) => {

  const [deployer, acc1, acc2] = accounts;
  const initSup = new bn(process.env.INITIAL_TOKENS);

  it('should not have any tokens in deployer account', async () => {
    let instance = await Token.deployed();
    return expect(await instance.balanceOf(deployer)).to.be.a.bignumber.equal(new bn(0));
  })

  it('all tokens should be in tokensale smart contract', async () => {
    let instance = await Token.deployed();
    expect(await instance.balanceOf(TokenSale.address)).to.be.a.bignumber.equal(new bn(process.env.INITIAL_TOKENS));
    return expect(await instance.balanceOf(deployer)).to.be.a.bignumber.equal(new bn(0));
  })
  it('should be possible to buy tokens', async () => {
    const instance = await Token.deployed();
    const instance2 = await TokenSale.deployed();
    const instance3 = await Kyc.deployed();

    const balanceBefore = await instance.balanceOf(deployer);

    const buyTokens = 2000;
    // can do like that too
    // await instance3.setKycCompleted(acc1, {from: deployer});
    await instance3.setKycCompleted(acc1);
    expect(await instance.balanceOf(acc1)).to.be.a.bignumber.equal(new bn(0));
    await expect(instance2.sendTransaction({from: acc1, value: web3.utils.toWei('' + buyTokens, 'wei')})).to.be.fulfilled;
    expect(await instance.balanceOf(TokenSale.address)).to.be.a.bignumber.equal(new bn(process.env.INITIAL_TOKENS-buyTokens));
    return expect(await instance.balanceOf(acc1)).to.be.a.bignumber.equal(new bn(buyTokens));
  })

})