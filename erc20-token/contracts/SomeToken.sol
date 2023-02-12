// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SomeToken is ERC20 {

    uint256 constant initialSupply = 10**6 * 10**18;

    constructor() ERC20("SomeToken", "STK") {
        _mint(msg.sender, initialSupply);
    }
}
