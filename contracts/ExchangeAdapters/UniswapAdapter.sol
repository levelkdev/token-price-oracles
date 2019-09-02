pragma solidity >=0.4.24;

import "../TPSafeMath.sol";
import "./IExchangeAdapter.sol";
import "./Uniswap/UniswapExchangeInterface.sol";
import "./Uniswap/UniswapFactoryInterface.sol";

contract UniswapAdapter is IExchangeAdapter {
  using TPSafeMath for uint;

  UniswapFactoryInterface public uniswapFactory;

  constructor(UniswapFactoryInterface _uniswapFactory) public {
    uniswapFactory = _uniswapFactory;
  }

  function getPriceForTokenPair(address token1, address token2)
    public
    view
    returns (uint price)
  {
    UniswapExchangeInterface token1Exchange = UniswapExchangeInterface(uniswapFactory.getExchange(token1));
    UniswapExchangeInterface token2Exchange = UniswapExchangeInterface(uniswapFactory.getExchange(token2));

    uint256 token1PriceEth = token1Exchange.getTokenToEthInputPrice(1 ether);
    uint256 token2PriceEth = token2Exchange.getTokenToEthInputPrice(1 ether);

    // calculate price in wei (price * 10 ** 18)
    price = (token1PriceEth.mul(1 ether)).div(token2PriceEth);
  }

  function tokenPairExists(address token1, address token2)
    public
    view
    returns (bool)
  {
    return
      uniswapFactory.getExchange(token1) != address(0) &&
      uniswapFactory.getExchange(token2) != address(0);
  }
}
