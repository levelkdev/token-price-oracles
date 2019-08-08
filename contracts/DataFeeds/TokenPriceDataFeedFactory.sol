pragma solidity >=0.4.24;

import "./TokenPriceDataFeed.sol";

contract TokenPriceDataFeedFactory {

  event TokenPriceDataFeedCreated(address tokenPriceDataFeed, address token1, address token2);

  IExchangeAdapter public exchangeAdapter;

  // token1 => token2 => TokenPriceDataFeed
  mapping(address => mapping(address => TokenPriceDataFeed)) public tokenPairToDataFeed;

  constructor(IExchangeAdapter _exchangeAdapter) public {
    exchangeAdapter = _exchangeAdapter;
  }

  function createTokenPriceDataFeed(
    address token1,
    address token2
  ) public {
    require(!tokenPriceDataFeedExists(token1, token2));

    TokenPriceDataFeed tokenPriceDataFeed = new TokenPriceDataFeed();
    tokenPriceDataFeed.initialize(token1, token2, exchangeAdapter);

    tokenPairToDataFeed[token1][token2] = tokenPriceDataFeed;

    emit TokenPriceDataFeedCreated(address(tokenPriceDataFeed), token1, token2);
  }

  function getTokenPriceDataFeed(address token1, address token2)
    public
    view
    returns (TokenPriceDataFeed)
  {
    return tokenPairToDataFeed[token1][token2];
  }

  function tokenPriceDataFeedExists(address token1, address token2)
    public
    view
    returns (bool)
  {
    return address(getTokenPriceDataFeed(token1, token2)) != address(0);
  }

}
