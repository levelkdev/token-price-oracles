pragma solidity >=0.4.24;

import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";
import "../ExchangeAdapters/IExchangeAdapter.sol";

contract TokenPriceDataFeed is DataFeedOracleBase {
  address public token1;
  address public token2;

  function initialize(address _token1, address _token2, address dataSource) public {
    token1 = _token1;
    token2 = _token2;
    DataFeedOracleBase.initialize(dataSource);
  }

  function logResult() public {
    IExchangeAdapter(dataSource).ping(token1, token2);
  }
}
