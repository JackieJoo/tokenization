// 0xe8Fe485A5faF1DcA767b0d4C8A4360535830B07B
import React, { Component } from "react";
import TokenContract from "./contracts/SUPPT.json";
import TokenSaleContract from "./contracts/TokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKycWhitelisting = this.handleKycWhitelisting.bind(this);
    this.updateUserTokens = this.updateUserTokens.bind(this);
    this.handleBuyTokens = this.handleBuyTokens.bind(this);

    this.state = {
      loaded: false,
      kycAddress: '',
      tokenSaleAddress: null,
      userTokens: 0
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.tokenInstance = new this.web3.eth.Contract(
        TokenContract.abi,
        TokenContract.networks[this.networkId] && TokenContract.networks[this.networkId].address
      );
      this.tokenSaleInstance = new this.web3.eth.Contract(
        TokenSaleContract.abi,
        TokenSaleContract.networks[this.networkId] && TokenSaleContract.networks[this.networkId].address
      );
      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address
      );

      this.listenToTokenTransfer();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true, tokenSaleAddress: TokenSaleContract.networks[this.networkId].address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({ [target.name]: value });
  }

  async updateUserTokens() {
    const userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({ userTokens });
  }

  async handleKycWhitelisting(event) {
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({ from: this.accounts[0] });
    alert(`You (${this.state.kycAddress}) have passed KYC`);
  }

  listenToTokenTransfer() {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on('data', this.updateUserTokens);
  }

  async handleBuyTokens() {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: this.web3.utils.toWei('5', 'wei') });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Super Puper Token (SUPPT) Sale</h1>
        <div>Get your tokens TODAY</div>
        <h2>KYC whitelisting</h2>
        <div>
          Address to allow:
          <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}></input>
          <button type="button" onClick={this.handleKycWhitelisting}>Submit</button>
        </div>
        <div>
          <h2>Buy Tokens</h2>
          <p> If you want to buy tokens, send Ether to this address: {this.state.tokenSaleAddress}</p>
          <p>You currently have {this.state.userTokens} SUPPT Tokens</p>
          <button type="button" onClick={this.handleBuyTokens}>Buy tokens</button>
        </div>
      </div>
    );
  }
}

export default App;
