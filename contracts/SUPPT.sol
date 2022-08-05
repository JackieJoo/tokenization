// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SUPPT is ERC20 {
    constructor(uint256 initialSupply) ERC20("Super Puper Token", "SUPPT") {
        _mint(msg.sender, initialSupply);
    }
}
