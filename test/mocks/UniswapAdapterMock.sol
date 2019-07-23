pragma solidity >=0.4.24;

contract UniswapAdapterMock {
  function getPriceForTokenPair(address token1, address token2) public view returns (uint price) {
    return 1;
  }
}
