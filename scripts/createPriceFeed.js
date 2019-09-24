const config = require('../src/config')
const getTokenData = require('../src/getTokenData')

const network = process.argv[5]
const tokenSymbol1 = process.argv[6]
const tokenSymbol2 = process.argv[7]

module.exports = async (callback) => {
  try {
    const TokenPriceDataFeedFactory = artifacts.require('TokenPriceDataFeedFactory')
    const { tokenPriceDataFeedFactory } = config(network)
    const priceFeedFactory = await TokenPriceDataFeedFactory.at(tokenPriceDataFeedFactory)

    const token1 = getTokenData(network, tokenSymbol1)
    const token2 = getTokenData(network, tokenSymbol2)

    if (!token1) {
      throw new Error(`No token found in conf.${network}.json for ${tokenSymbol1}`)
    }
    if (!token2) {
      throw new Error(`No token found in conf.${network}.json for ${tokenSymbol2}`)
    }

    console.log(`Creating price feed for <${token1.symbol}:${token1.address}>/<${token2.symbol}:${token2.address}>...`)
    const { logs } = await priceFeedFactory.createTokenPriceDataFeed(token1.address, token2.address)
    const priceFeedAddress = logs[0].args.tokenPriceDataFeed
    console.log('Price feed created: ', priceFeedAddress)
    console.log('')

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    }
  } catch (err) {
    console.log('Error in scripts/createPriceFeed.js: ', err)
  }
}
