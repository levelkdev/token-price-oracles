pragma solidity >=0.4.24;

interface IExchangeAdapter {
  // Gets the current price for the token1/token2 pair
  function getPriceForTokenPair(address token1, address token2) public view returns (uint price);

  // Returns true if the token1/token2 pair exists
  function tokenPairExists(address token1, address token2) public view returns (bool);
}
