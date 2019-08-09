pragma solidity >=0.4.24;

import "../../contracts/ExchangeAdapters/IExchangeAdapter.sol";

contract ExchangeAdapterMock is IExchangeAdapter {

  mapping(address => bool) mock_tokenExists;

  constructor(address[] tokenAddresses) {
    for(uint i = 0; i < tokenAddresses.length; i++) {
      mock_tokenExists[tokenAddresses[i]] = true;
    }
  }

  function getPriceForTokenPair(address token1, address token2) public view returns (uint price) {
    return 1;
  }

  function tokenPairExists(address token1, address token2) public view returns (bool) {
    return mock_tokenExists[token1] && mock_tokenExists[token2];
  }
}
