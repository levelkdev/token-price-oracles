const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed.sol')
const UniswapAdapterMock = artifacts.require('UniswapAdapterMock.sol')
const { increaseTime, expectRevert, uintToBytes32 } = require('./helpers')

const BYTES32_ONE = '0x0000000000000000000000000000000000000000000000000000000000000001'

contract('TokenPriceDataFeed', (accounts) => {
  let tokenPriceDataFeed, uniswapAdapterMock, token1, token2

  beforeEach(async () => {
    tokenPriceDataFeed = await TokenPriceDataFeed.new()
    uniswapAdapterMock = await UniswapAdapterMock.new()
    token1 = accounts[1]
    token2 = accounts[2]
  })

  describe('initialize', () => {
    it('initializes with the correct token pair', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      expect(await tokenPriceDataFeed.token1()).to.equal(token1)
      expect(await tokenPriceDataFeed.token2()).to.equal(token2)
    })

    it('initializes with the correct exchangeAdapter address', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      expect(await tokenPriceDataFeed.exchangeAdapter()).to.equal(uniswapAdapterMock.address)
    })

    it('initializes with address(this) as the dataSource', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      expect(await tokenPriceDataFeed.dataSource()).to.equal(tokenPriceDataFeed.address)
    })

    it('reverts if initialized twice', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      await expectRevert.unspecified (
        tokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address),
        'cannot call initialize twice'
      )
    })
  })

  describe('logResult()', () => {
    it('sets result on the data feed contract', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      const { logs } = await tokenPriceDataFeed.logResult()
      expect(logs[0].event).to.equal('ResultSet')
      expect(logs[0].args._result).to.equal(BYTES32_ONE)
    })
  })

  describe('setResult()', () => {
    it('cannot be called publicly', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, uniswapAdapterMock.address)
      await expectRevert.unspecified (
        tokenPriceDataFeed.setResult(1, 1),
        'cannot call setResult publicly'
      )
    })
  })
})
