pragma solidity >=0.4.24;

interface IExchangeAdapter {
  // calls setResult on the calling DataFeed with the current price of token1 in units of token2 * 10 ** 18
  function ping(address token1, address token2) public;

  // returns the value of 1 token1 in units of token2 * 10 ** 18
  function calculateTokenPrice(address token1, address token2) public returns (uint);
}
