const config = require('../src/config')
const bytes32ToNum = require('../src/bytes32ToNum')
const getTokenData = require('../src/getTokenData')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const network = process.argv[5]
const tokenSymbol1 = process.argv[6]
const tokenSymbol2 = process.argv[7]
                
module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts
  } = {}
) => {
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

    console.log(`TokenPriceDataFeed:<${priceFeedAddress}> viewCurrentResult()...`)
    const priceFeed = TokenPriceDataFeed.at(priceFeedAddress)
    const result = await priceFeed.viewCurrentResult()
    console.log('Bytes32 result: ', result)
    console.log('Number result: ', bytes32ToNum(result)/(10**18))
    console.log()

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    }
  } catch (err) {
    console.log('Error in scripts/priceReport.js: ', err)
  }
}
