const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed.sol')
const ExchangeAdapterMock = artifacts.require('ExchangeAdapterMock.sol')
const { increaseTime, expectRevert, uintToBytes32 } = require('./helpers')

const BYTES32_ONE = '0x0000000000000000000000000000000000000000000000000000000000000001'
const token1 = '0x19a150a4e966bac5bd0473153f5c526d8fa7d4e7'
const token2 = '0xa27d79db9c02ab01de0ca0f8468cbad2c578f609'
const token3 = '0xca93ab2dc789c53b062253690ed33ae4eaed4ba3'

contract('TokenPriceDataFeed', () => {
  let tokenPriceDataFeed, exchangeAdapterMock

  beforeEach(async () => {
    tokenPriceDataFeed = await TokenPriceDataFeed.new()
    exchangeAdapterMock = await ExchangeAdapterMock.new([token1, token2])
  })

  describe('initialize', () => {
    it('initializes with the correct token pair', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, exchangeAdapterMock.address)
      expect(await tokenPriceDataFeed.token1()).to.equal(token1)
      expect(await tokenPriceDataFeed.token2()).to.equal(token2)
    })

    it('initializes with the correct exchangeAdapter address', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, exchangeAdapterMock.address)
      expect(await tokenPriceDataFeed.exchangeAdapter()).to.equal(exchangeAdapterMock.address)
    })

    it('initializes with address(this) as the dataSource', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, exchangeAdapterMock.address)
      expect(await tokenPriceDataFeed.dataSource()).to.equal(tokenPriceDataFeed.address)
    })

    it('reverts if initialized twice', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, exchangeAdapterMock.address)
      await expectRevert.unspecified (
        tokenPriceDataFeed.initialize(token1, token2, exchangeAdapterMock.address),
        'cannot call initialize twice'
      )
    })

    it('reverts if initialized with a token pair that does not exist', async () => {
      await expectRevert.unspecified (
        tokenPriceDataFeed.initialize(token1, token3, exchangeAdapterMock.address),
        'token pair does not exist'
      )
    })
  })

  describe('logResult()', () => {
    it('sets result on the data feed contract', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, exchangeAdapterMock.address)
      const { logs } = await tokenPriceDataFeed.logResult()
      expect(logs[0].event).to.equal('ResultSet')
      expect(logs[0].args._result).to.equal(BYTES32_ONE)
    })
  })

  describe('setResult()', () => {
    it('cannot be called publicly', async () => {
      await tokenPriceDataFeed.initialize(token1, token2, exchangeAdapterMock.address)
      await expectRevert.unspecified (
        tokenPriceDataFeed.setResult(1, 1),
        'cannot call setResult publicly'
      )
    })
  })
})
