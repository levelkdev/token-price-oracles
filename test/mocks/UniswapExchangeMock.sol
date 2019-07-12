contract UniswapExchangeMock {
  uint mock_returnPrice;

  constructor(uint returnPrice) {
    mock_returnPrice = returnPrice;
  }

  function getTokenToEthInputPrice(uint eth) external view returns (uint) {
    return mock_returnPrice;
  }
}
