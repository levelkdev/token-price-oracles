pragma solidity >=0.4.24;

import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "tidbit/contracts/DataFeedOracles/DataFeedOracleBase.sol";
import "./IExchangeAdapter.sol";
import "./Uniswap/UniswapExchangeInterface.sol";
import "./Uniswap/UniswapFactoryInterface.sol";

contract UniswapAdapter is IExchangeAdapter {
  using SafeMath for uint;

  event PriceCalculated(uint price, address token1, address token2);

  UniswapFactoryInterface public uniswapFactory;

  constructor(address _uniswapFactory) public {
    uniswapFactory = UniswapFactoryInterface(_uniswapFactory);
  }

  function ping(address token1, address token2) public {
    uint price = calculateTokenPrice(token1, token2);
    DataFeedOracleBase dataFeed = DataFeedOracleBase(msg.sender);
    dataFeed.setResult(bytes32(price), uint256(block.timestamp));
  }

  function calculateTokenPrice(address token1, address token2) public returns (uint price) {
    UniswapExchangeInterface token1Exchange = UniswapExchangeInterface(uniswapFactory.getExchange(token1));
    UniswapExchangeInterface token2Exchange = UniswapExchangeInterface(uniswapFactory.getExchange(token2));

    uint256 token1PriceEth = token1Exchange.getTokenToEthInputPrice(1 ether);
    uint256 token2PriceEth = token2Exchange.getTokenToEthInputPrice(1 ether);

    // calculate price in wei (price * 10 ** 18)
    price = (token1PriceEth.mul(1 ether)).div(token2PriceEth);
    emit PriceCalculated(price, token1, token2);
  }
}
