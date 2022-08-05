// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    function setKycCompleted(address _address) public onlyOwner {
        allowed[_address] = true;
    }

    function setKycRevoked(address _address) public onlyOwner {
        allowed[_address] = false;
    }

    function kycIsCompleted(address _address) public view returns (bool) {
        return allowed[_address];
    }
}
