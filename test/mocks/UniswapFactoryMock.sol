pragma solidity >=0.4.24;

contract UniswapFactoryMock {
  function getExchange(address _exchange) public returns (address exchange) {
    exchange = _exchange;
  }
}
