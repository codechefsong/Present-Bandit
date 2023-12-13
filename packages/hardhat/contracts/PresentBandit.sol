//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ERC6551Registry.sol";
import "./PresentToken.sol";

contract PresentBandit {
  ERC6551Registry public registry;
  PresentToken public presentToken;

  address public immutable owner;
  Box[] public grid;
  mapping(address => address) public tbaList;
  mapping(address => uint256) public player;
  mapping(address => uint256) public playerTimeLeft;
  mapping(address => bool) public isPaid;

  struct Box {
    uint256 id;
    string typeGrid;
  }
  
  constructor(address _owner, address _registryAddress, address _tokenAddress) {
    owner = _owner;
    registry = ERC6551Registry(_registryAddress);
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

  function createTokenBoundAccount(
    address _implementation,
    uint256 _chainId,
    address _tokenContract,
    uint256 _tokenId,
    uint256 _salt,
    bytes calldata _initData
  ) external {
    address newTBA = registry.createAccount(_implementation, _chainId, _tokenContract, _tokenId, _salt, _initData);
    tbaList[msg.sender] = newTBA;
  }

  function addPlayer() public {
    address tbaAddress = tbaList[msg.sender];
    player[tbaAddress] = 0;
    playerTimeLeft[tbaAddress] = 100;
    isPaid[tbaAddress] = true;
  }

  function movePlayer() public {
    address tbaAddress = tbaList[msg.sender];
    player[tbaAddress] += 1;
    playerTimeLeft[tbaAddress] -= 1;
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