pragma solidity >=0.4.24;

import "../../contracts/ExchangeAdapters/IExchangeAdapter.sol";

contract ExchangeAdapterMock is IExchangeAdapter {

  mapping(address => bool) mock_tokenExists;
  mapping(address => mapping(address => uint)) mock_tokenPrices;

  constructor(address[] tokenAddresses) {
    for(uint i = 0; i < tokenAddresses.length; i++) {
      mock_tokenExists[tokenAddresses[i]] = true;
    }
  }

  function setPriceForTokenPair(address token1, address token2, uint price) {
    mock_tokenPrices[token1][token2] = price;
  }

  function getPriceForTokenPair(address token1, address token2) public view returns (uint price) {
    return mock_tokenPrices[token1][token2];
  }

  function tokenPairExists(address token1, address token2) public view returns (bool) {
    return mock_tokenExists[token1] && mock_tokenExists[token2];
  }
}
