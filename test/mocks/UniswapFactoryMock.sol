pragma solidity >=0.4.24;

contract UniswapFactoryMock {

  mapping(address => address) mock_tokenToExchange;

  constructor(address[] tokenAddresses, address[] exchangeAddresses) {
    for(uint i = 0; i < tokenAddresses.length; i++) {
      mock_tokenToExchange[tokenAddresses[i]] = exchangeAddresses[i];
    }
  }

  function getExchange(address token) public returns (address) {
    return mock_tokenToExchange[token];
  }
}
