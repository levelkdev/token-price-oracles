pragma solidity >=0.4.24;

import "./TimeMedianDataFeed.sol";
import "../ExchangeAdapters/IExchangeAdapter.sol";

contract TokenPriceDataFeed is TimeMedianDataFeed {
  address public token1;
  address public token2;
  IExchangeAdapter public exchangeAdapter;

  function initialize(
    address _token1,
    address _token2,
    IExchangeAdapter _exchangeAdapter
  )
    public
  {
    require(_exchangeAdapter.tokenPairExists(_token1, _token2), 'token pair does not exist');

    token1 = _token1;
    token2 = _token2;
    exchangeAdapter = _exchangeAdapter;

    // set dataSource to `this` so setResult can only be called from this contract
    DataFeedOracleBase.initialize(address(this));
  }

  /**
  * @dev logs current exchange price in dataFeed at current block timestamp
  */
  function logResult() public {
    uint price = exchangeAdapter.getPriceForTokenPair(token1, token2);
    TimeMedianDataFeed(this).setResult(bytes32(price), uint256(block.timestamp));
  }

  /**
  * @dev returns the value of the current price according to the exchange
  */
  function viewCurrentResult() public view returns (bytes32) {
    return bytes32(exchangeAdapter.getPriceForTokenPair(token1, token2));
  }
}
