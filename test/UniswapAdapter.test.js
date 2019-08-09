const UniswapAdapter = artifacts.require('UniswapAdapter.sol')
const UniswapFactoryMock = artifacts.require('UniswapFactoryMock.sol')
const UniswapExchangeMock = artifacts.require('UniswapExchangeMock.sol')

const token1 = '0x19a150a4e966bac5bd0473153f5c526d8fa7d4e7'
const token2 = '0xa27d79db9c02ab01de0ca0f8468cbad2c578f609'
const token3 = '0xca93ab2dc789c53b062253690ed33ae4eaed4ba3'

contract('UniswapAdapter', (accounts) => {
  let uniswapAdapter, uniswapFactoryMock, uniswapExchangeMock1, uniswapExchangeMock2

  beforeEach(async () => {
    uniswapExchangeMock1 = await UniswapExchangeMock.new(1 * 10 ** 18)
    uniswapExchangeMock2 = await UniswapExchangeMock.new(2 * 10 ** 18)
    uniswapFactoryMock = await UniswapFactoryMock.new(
      [token1, token2],
      [uniswapExchangeMock1.address, uniswapExchangeMock2.address]
    )
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
        await uniswapAdapter.getPriceForTokenPair(token1, token2)
      ).toNumber()
      const expectedResult = (await getExpectedPrice(uniswapExchangeMock1, uniswapExchangeMock2)).toNumber()
      expect(returnedResult).to.equal(expectedResult)
    })

    // to test 2 token pairs
    it('returns the correct token price for inverse token pair', async () => {
      const returnedResult = (
        await uniswapAdapter.getPriceForTokenPair(token2, token1)
      ).toNumber()
      const expectedResult = (await getExpectedPrice(uniswapExchangeMock2, uniswapExchangeMock1)).toNumber()
      expect(returnedResult).to.equal(expectedResult)
    })
  })

  describe('tokenPairExists()', () => {
    describe('when given a token pair that exists', () => {
      it('should return true', async () => {
        expect(await uniswapAdapter.tokenPairExists(token1, token2)).to.equal(true)
      })
    })

    describe('when given a token pair that does not exist', () => {
      it('should return false', async () => {
        expect(await uniswapAdapter.tokenPairExists(token1, token3)).to.equal(false)
      })
    })
  })
})

async function getExpectedPrice(exchange1, exchange2) {
  const exchange1Price = await exchange1.getTokenToEthInputPrice(1 * 10 ** 18)
  const exchange2Price = await exchange2.getTokenToEthInputPrice(1 * 10 ** 18)
  return (exchange1Price.times(1 * 10 ** 18)).dividedBy(exchange2Price)
}
