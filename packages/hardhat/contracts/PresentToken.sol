//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PresentToken is ERC20 {
  constructor() ERC20("Present Token", "Pst") {}

  function mint(address account, uint256 amount) public {
    _mint(account, amount);
  }
}