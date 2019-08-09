const config = require('../src/config')
const bytes32ToNum = require('../src/bytes32ToNum')
const getTokenData = require('../src/getTokenData')

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const network = process.argv[5]
const tokenSymbol1 = process.argv[6]
const tokenSymbol2 = process.argv[7]

module.exports = async (callback) => {
  try {
    const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed')
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

    console.log(`Getting price feed for ${token1.symbol}/${token2.symbol}...`)
    const priceFeedAddress = await priceFeedFactory.getTokenPriceDataFeed(token1.address, token2.address)

    if (priceFeedAddress == ZERO_ADDRESS) {
      throw new Error(`Price feed for ${token1.symbol}/${token2.symbol} does not exist. Run "npm run createPriceFeed:${network} ${token1.symbol} ${token2.symbol}" to create it.`)
    }

    console.log('Got price feed: ', priceFeedAddress)
    console.log('')

    const priceFeed = await TokenPriceDataFeed.at(priceFeedAddress)
    console.log(`Logging price for ${token1.symbol}/${token2.symbol}...`)

    const tx = await priceFeed.logResult()
    const { logs } = tx
    const price = bytes32ToNum(logs[0].args._result)
    console.log(`Tx complete: ${tx.tx}`)
    console.log(`Logged price: ${price/10**18}`)
    console.log('')

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    }
  } catch (err) {
    console.log('Error in scripts/logPrice.js: ', err)
  }
}
