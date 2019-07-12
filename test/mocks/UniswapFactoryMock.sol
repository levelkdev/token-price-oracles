contract UniswapFactoryMock {
  function getExchange(address _exchange) public returns (address exchange) {
    exchange = _exchange;
  }
}
