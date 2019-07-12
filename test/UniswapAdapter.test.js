const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed.sol')
const UniswapAdapter = artifacts.require('UniswapAdapter.sol')
const UniswapFactoryMock = artifacts.require('UniswapFactoryMock.sol')
const UniswapExchangeMock = artifacts.require('UniswapExchangeMock.sol')
const { increaseTime, uintToBytes32 } = require('./helpers')

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

  describe('ping()', () => {
    let tokenPriceDataFeed

    beforeEach(async () => {
      tokenPriceDataFeed = await TokenPriceDataFeed.new()
      await tokenPriceDataFeed.initialize(
        uniswapExchangeMock1.address,
        uniswapExchangeMock2.address,
        uniswapAdapter.address
      )
    })

    it('updates the DataFeed with the correct price and date', async () => {
      const expectedResult = uintToBytes32(await getExpectedPrice(uniswapExchangeMock1, uniswapExchangeMock2))
      await tokenPriceDataFeed.logResult();
      const returnedResult = await tokenPriceDataFeed.resultByIndexFor(1)

      expect(returnedResult[0]).to.equal(expectedResult)
      expect(returnedResult[1].toNumber()).to.be.greaterThan(0)
    })
  })

  describe('caluclateTokenPrice()', () => {
    it('returns the correct token price', async () => {
      const returnedResult = (
        await uniswapAdapter.calculateTokenPrice.call(
        uniswapExchangeMock1.address,
        uniswapExchangeMock2.address)
      ).toNumber()
      const expectedResult = (await getExpectedPrice(uniswapExchangeMock1, uniswapExchangeMock2)).toNumber()
      expect(returnedResult).to.equal(expectedResult)
    })

    // to test 2 token pairs
    it('returns the correct token price for inverse token pair', async () => {
      const returnedResult = (
        await uniswapAdapter.calculateTokenPrice.call(
        uniswapExchangeMock2.address,
        uniswapExchangeMock1.address)
      ).toNumber()
      const expectedResult = (await getExpectedPrice(uniswapExchangeMock2, uniswapExchangeMock1)).toNumber()
      expect(returnedResult).to.equal(expectedResult)
    })

    it('emits a PriceCalculated event with the correct args', async () => {
      const { logs } = await uniswapAdapter.calculateTokenPrice(uniswapExchangeMock1.address, uniswapExchangeMock2.address)
      const args = logs[0].args
      expect(logs[0].event).to.equal('PriceCalculated')
      expect(args.token1).to.equal(uniswapExchangeMock1.address)
      expect(args.token2).to.equal(uniswapExchangeMock2.address)
      expect(args.price.toNumber()).to.equal((await getExpectedPrice(uniswapExchangeMock1, uniswapExchangeMock2)).toNumber())
    })
  })
})

async function getExpectedPrice(exchange1, exchange2) {
  const exchange1Price = await exchange1.getTokenToEthInputPrice(1 * 10 ** 18)
  const exchange2Price = await exchange2.getTokenToEthInputPrice(1 * 10 ** 18)
  return (exchange1Price.times(1 * 10 ** 18)).dividedBy(exchange2Price)
}
