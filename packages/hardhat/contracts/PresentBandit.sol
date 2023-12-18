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
  mapping(address => uint256) public playerWeight;
  mapping(address => bool) public isPaid;

  event PlayEvent(address player, address nft, string detail);

  // 0 - home
  // 1 - finish
  // 2 - house
  // 3 - event
  struct Box {
    uint256 id;
    string typeGrid;
    uint256 typeNum;
  }
  
  constructor(address _owner, address _registryAddress, address _tokenAddress) {
    owner = _owner;
    registry = ERC6551Registry(_registryAddress);
    presentToken = PresentToken(_tokenAddress);

    grid.push(Box(0, "home", 0));

    for (uint256 id = 1; id < 13; id++) {
      if (id == 2 || id == 5|| id == 8 || id == 10) grid.push(Box(id, "house", 2));
      else if (id == 3 || id == 7 ) grid.push(Box(id, "event", 3));
      else grid.push(Box(id, "", 99));
    }

    grid.push(Box(14, "finish", 1));
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
    playerWeight[tbaAddress] = 1;
    isPaid[tbaAddress] = true;
  }

  function movePlayer() public {
    address tbaAddress = tbaList[msg.sender];
    if (playerTimeLeft[tbaAddress] < playerWeight[tbaAddress]) {
      playerTimeLeft[tbaAddress] = 0;
    }
    else {
      player[tbaAddress] += 1;
      playerTimeLeft[tbaAddress] -= playerWeight[tbaAddress];
    }
  }

  function stealPresent() public {
    address tbaAddress = tbaList[msg.sender];
    uint256 position = player[tbaAddress];
    require(grid[position].typeNum == 2, "You cannot steal present at this place");

    uint256 timeCost = randomNumber(15);

    if (playerTimeLeft[tbaAddress] < timeCost + 5) {
      playerTimeLeft[tbaAddress] = 0;
    }
    else {
      playerTimeLeft[tbaAddress] -= timeCost + 5;

      presentToken.mint(tbaAddress, 1 * 10 ** 18);
      playerWeight[tbaAddress] += 2;
    }
  }

  function dropPresent() public {
    address tbaAddress = tbaList[msg.sender];
    uint tokenAmount = presentToken.balanceOf(tbaAddress);

    require(tokenAmount > 0, "You do not have any present");

    presentToken.burn(tbaAddress, 1 * 10 ** 18);
    playerWeight[tbaAddress] -= 2;
  }

  function gameOver() public {
    address tbaAddress = tbaList[msg.sender];

    uint amount = presentToken.balanceOf(tbaAddress);

    presentToken.burn(tbaAddress, amount);

    isPaid[tbaAddress] = false;
  }

  function randomEvent() public {
    address tbaAddress = tbaList[msg.sender];

    uint256 num = randomNumber(5);

    if (num == 1) {
      presentToken.mint(tbaAddress, 1 * 10 ** 18);
      playerWeight[tbaAddress] += 2;
      emit PlayEvent(msg.sender, tbaAddress, "You found a present");
    }
    else if (num == 2) {
      uint amount = presentToken.balanceOf(tbaAddress);
      if (amount > 0) {
        presentToken.burn(tbaAddress, 1 * 10 ** 18);
        playerWeight[tbaAddress] -= 2;
        emit PlayEvent(msg.sender, tbaAddress, "You lost a present");
      }
      else {
        emit PlayEvent(msg.sender, tbaAddress, "Nothing happen");
      }
    }
    else if (num == 3) {
      if (playerTimeLeft[tbaAddress] < 10) {
        playerTimeLeft[tbaAddress] = 0;
      }
      else {
        playerTimeLeft[tbaAddress] -= 10;
      }
      emit PlayEvent(msg.sender, tbaAddress, "You were delay because of snow storm");
    }
    else {
      emit PlayEvent(msg.sender, tbaAddress, "Nothing happen");
    }
  }
  
  function randomNumber(uint256 num) internal view returns (uint256) {
    return uint256(keccak256(abi.encode(block.timestamp, msg.sender))) % num;
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