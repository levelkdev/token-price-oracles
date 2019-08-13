const TokenPriceDataFeedFactory = artifacts.require('TokenPriceDataFeedFactory.sol')
const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed.sol')
const ExchangeAdapterMock = artifacts.require('ExchangeAdapterMock.sol')
const { expectRevert } = require('./helpers')

const token1 = '0x19a150a4e966bac5bd0473153f5c526d8fa7d4e7'
const token2 = '0xa27d79db9c02ab01de0ca0f8468cbad2c578f609'
const token3 = '0xca93ab2dc789c53b062253690ed33ae4eaed4ba3'

contract('TokenPriceDataFeedFactory', () => {
  let tokenPriceDataFeedFactory, exchangeAdapterMock

  beforeEach(async () => {
    exchangeAdapterMock = await ExchangeAdapterMock.new([token1, token2])
    tokenPriceDataFeedFactory = await TokenPriceDataFeedFactory.new(exchangeAdapterMock.address)
  })

  it('should set the correct exchangeAdapter', async () => {
    expect(
      await tokenPriceDataFeedFactory.exchangeAdapter()
    ).to.equal(exchangeAdapterMock.address)
  })

  describe('createTokenPriceDataFeed()', () => {
    describe('when given valid parameters', () => {

      let tokenPriceDataFeed

      beforeEach(async () => {
        const { logs } = await tokenPriceDataFeedFactory.createTokenPriceDataFeed(
          token1,
          token2
        )
        tokenPriceDataFeed = await TokenPriceDataFeed.at(logs[0].args.tokenPriceDataFeed)
      })

      it('should create a TokenPriceDataFeed with the correct token pair', async () => {
        expect(await tokenPriceDataFeed.token1()).to.equal(token1)
        expect(await tokenPriceDataFeed.token2()).to.equal(token2)
      })

      it('should create a TokenPriceDataFeed with the correct exchange adapter', async () => {
        expect(await tokenPriceDataFeed.exchangeAdapter()).to.equal(exchangeAdapterMock.address)
      })
    })

    describe('when executed twice with the same token pair', () => {
      it('should revert', async () => {
        await tokenPriceDataFeedFactory.createTokenPriceDataFeed(token1, token2)
        await expectRevert.unspecified (
          tokenPriceDataFeedFactory.createTokenPriceDataFeed(token1, token2),
          'cannot create duplicate TokenPriceDataFeed'
        )
      })
    })

    describe('when executed twice with the same token pair', () => {
      it('should revert', async () => {
        await tokenPriceDataFeedFactory.createTokenPriceDataFeed(token1, token2)
        await expectRevert.unspecified (
          tokenPriceDataFeedFactory.createTokenPriceDataFeed(token1, token2),
          'cannot create duplicate TokenPriceDataFeed'
        )
      })
    })
  })

  describe('getTokenPriceDataFeed()', () => {
    let tokenPriceDataFeed

    beforeEach(async () => {
      const { logs } = await tokenPriceDataFeedFactory.createTokenPriceDataFeed(
        token1,
        token2
      )
      tokenPriceDataFeed = await TokenPriceDataFeed.at(logs[0].args.tokenPriceDataFeed)
    })

    it('returns TokenPriceDataFeed for token pair', async () => {
      expect(await tokenPriceDataFeedFactory.getTokenPriceDataFeed(token1, token2))
        .to.equal(tokenPriceDataFeed.address)
    })
  })

  describe('tokenPriceDataFeedExists()', () => {
    beforeEach(async () => {
      await tokenPriceDataFeedFactory.createTokenPriceDataFeed(token1, token2)
    })

    it('returns true if TokenPriceDataFeed for token pair exists', async () => {
      expect(await tokenPriceDataFeedFactory.tokenPriceDataFeedExists(token1, token2))
        .to.equal(true)
    })

    it('returns false if TokenPriceDataFeed for token pair does not exist', async () => {
      expect(await tokenPriceDataFeedFactory.tokenPriceDataFeedExists(token1, token3))
        .to.equal(false)
    })
  })
})
