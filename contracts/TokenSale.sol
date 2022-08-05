// SPDX-License-Identifier: MIT

import "./Crowdsale.sol";
import "./KycContract.sol";

pragma solidity ^0.8.13;

contract TokenSale is Crowdsale {
    KycContract kyc;

    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet, // this wallet will receive ether that is send to this contract
        IERC20 token,
        KycContract _kyc
    ) public Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycIsCompleted(msg.sender), "You need to complete KYC");
    }
}
