pragma solidity >=0.4.24;

import "./TokenPriceDataFeed.sol";

contract TokenPriceDataFeedFactory {

  event TokenPriceDataFeedCreated(address tokenPriceDataFeed, address token1, address token2);

  IExchangeAdapter public exchangeAdapter;

  constructor(IExchangeAdapter _exchangeAdapter) public {
    exchangeAdapter = _exchangeAdapter;
  }

  function createTokenPriceDataFeed(
    address token1,
    address token2
  ) public {
    TokenPriceDataFeed tokenPriceDataFeed = new TokenPriceDataFeed();
    tokenPriceDataFeed.initialize(token1, token2, exchangeAdapter);

    emit TokenPriceDataFeedCreated(address(tokenPriceDataFeed), token1, token2);
  }

}
