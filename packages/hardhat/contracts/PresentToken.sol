//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PresentToken is ERC20 {
  constructor() ERC20("Present Token", "Pst") {}

  function mint(address account, uint256 amount) public {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) public {
    _burn(account, amount);
  }

  function getBalance(address account) public view returns (uint) {
    return balanceOf(account);
  }
}