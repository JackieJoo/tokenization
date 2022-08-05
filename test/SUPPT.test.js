require('dotenv').config({path: '../.env'});
const chai = require('./setupChai');
const bn = web3.utils.BN;

const Token = artifacts.require('SUPPT');
let MyToken;

const expect = chai.expect;

contract('Token Test', async (accounts) => {

  const [deployer, acc1, acc2] = accounts;
  const initSup = new bn(process.env.INITIAL_TOKENS);

  beforeEach(async () => {
    MyToken = await Token.new(process.env.INITIAL_TOKENS);
  })
  
  it('all tokens should be in owner\'s account', async () => {
    let instance = MyToken;
    let totalSupply = await instance.totalSupply();
    let balance = await instance.balanceOf(deployer);
    expect(await balance.valueOf()).to.be.a.bignumber.equal(totalSupply);
    expect(await balance.valueOf()).to.be.a.bignumber.equal(initSup);
    return expect(totalSupply).to.be.a.bignumber.equal(initSup);
  })
  it('s possible to send tokens between accs', async () => {
    let instance = MyToken;
    const sendToTokens = 1;
    let totalSupply = await instance.totalSupply();
    const deployerBalanceBeforeTransfer = await instance.balanceOf(deployer);
    // expect(await instance.balanceOf(acc1).valueOf()).to.be.a.bignumber.equal(new bn(0));
    // expect(await instance.balanceOf(acc2).valueOf()).to.be.a.bignumber.equal(new bn(0));
    await expect(instance.transfer(acc1, sendToTokens)).to.be.fulfilled;
    expect(await instance.balanceOf(deployer).valueOf()).to.be.a.bignumber.equal(deployerBalanceBeforeTransfer.sub(new bn(sendToTokens)));
    return expect(await instance.balanceOf(acc1).valueOf()).to.be.a.bignumber.equal(new bn(sendToTokens));
  })
  it('s NOT possible to send MORE tokens that is available', async () => {
    let instance = MyToken;
    const sendToTokens = 1_000_001;
    let totalSupply = await instance.totalSupply();
    expect(totalSupply).to.be.a.bignumber.equal(initSup);
    return expect(instance.transfer(acc1, sendToTokens)).to.be.rejected;
  })
})