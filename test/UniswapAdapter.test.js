const UniswapAdapter = artifacts.require('UniswapAdapter.sol')
const UniswapFactoryMock = artifacts.require('UniswapFactoryMock.sol')
const UniswapExchangeMock = artifacts.require('UniswapExchangeMock.sol')

contract('UniswapAdapter', (accounts) => {
  let uniswapAdapter, uniswapFactoryMock, uniswapExchangeMock1, uniswapExchangeMock2

  beforeEach(async () => {
    uniswapFactoryMock = await UniswapFactoryMock.new()
    uniswapExchangeMock1 = await UniswapExchangeMock.new(1 * 10 ** 18)
    uniswapExchangeMock2 = await UniswapExchangeMock.new(2 * 10 ** 18)
    uniswapAdapter = await UniswapAdapter.new(uniswapFactoryMock.address)
  })

  describe('initialize()', () => {
    it('sets the correct UniswapFactory', async () => {
      expect(await uniswapAdapter.uniswapFactory()).to.equal(uniswapFactoryMock.address)
    })
  })

  describe('getPriceForTokenPair()', () => {
    it('returns the correct price for the given token pair', async () => {
      const returnedResult = (
        await uniswapAdapter.getPriceForTokenPair.call(
        uniswapExchangeMock1.address,
        uniswapExchangeMock2.address)
      ).toNumber()
      const expectedResult = (await getExpectedPrice(uniswapExchangeMock1, uniswapExchangeMock2)).toNumber()
      expect(returnedResult).to.equal(expectedResult)
    })

    // to test 2 token pairs
    it('returns the correct token price for inverse token pair', async () => {
      const returnedResult = (
        await uniswapAdapter.getPriceForTokenPair.call(
        uniswapExchangeMock2.address,
        uniswapExchangeMock1.address)
      ).toNumber()
      const expectedResult = (await getExpectedPrice(uniswapExchangeMock2, uniswapExchangeMock1)).toNumber()
      expect(returnedResult).to.equal(expectedResult)
    })
  })
})

async function getExpectedPrice(exchange1, exchange2) {
  const exchange1Price = await exchange1.getTokenToEthInputPrice(1 * 10 ** 18)
  const exchange2Price = await exchange2.getTokenToEthInputPrice(1 * 10 ** 18)
  return (exchange1Price.times(1 * 10 ** 18)).dividedBy(exchange2Price)
}
