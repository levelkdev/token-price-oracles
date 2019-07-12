import 'tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol';

contract UniswapAdapterMock {
  event PingCalled(address token1, address token2);

  function ping(address token1, address token2) public {
    emit PingCalled(token1, token2);
    DataFeedOracleBase dataFeed = DataFeedOracleBase(msg.sender);
    dataFeed.setResult(bytes32(1), uint256(block.timestamp));
  }
}
