//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./PresentToken.sol";

contract PresentBandit {
  PresentToken public presentToken;

  address public immutable owner;
  Box[] public grid;
  mapping(address => uint256) public player;
  mapping(address => uint256) public playerTimeLeft;
  mapping(address => bool) public isPaid;

  struct Box {
    uint256 id;
    string typeGrid;
  }
  
  constructor(address _owner, address _tokenAddress) {
    owner = _owner;
    presentToken = PresentToken(_tokenAddress);

    grid.push(Box(0, "home"));

    for (uint256 id = 1; id < 13; id++) {
      grid.push(Box(id, "empty"));
    }

    grid.push(Box(14, "finsh"));
  }

  function getGrid() public view returns (Box[] memory){
    return grid;
  }

  function addPlayer() public {
    player[msg.sender] = 0;
    playerTimeLeft[msg.sender] = 100;
    isPaid[msg.sender] = true;
  }

  modifier isOwner() {
    require(msg.sender == owner, "Not the Owner");
    _;
  }

  function withdraw() public isOwner {
    (bool success, ) = owner.call{ value: address(this).balance }("");
    require(success, "Failed to send Ether");
  }

  receive() external payable {}
}