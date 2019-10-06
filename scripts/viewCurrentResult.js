const bytes32ToNum = require('../src/bytes32ToNum')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle
const network = process.argv[5]
const tokenPriceDataFeedAddress = process.argv[6]
                
module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts
  } = {}
) => {
  try {
    const TokenPriceDataFeed = artifacts.require('TokenPriceDataFeed')
    const tokenPriceDataFeed = TokenPriceDataFeed.at(tokenPriceDataFeedAddress)

    console.log(`TokenPriceDataFeed:<${tokenPriceDataFeedAddress}> viewCurrentResult()...`)
    const result = await tokenPriceDataFeed.viewCurrentResult()
    console.log('Bytes32 result: ', result)
    console.log('Number result: ', bytes32ToNum(result)/(10**18))

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    }
  } catch (err) {
    console.log('Error in scripts/viewCurrentResult.js: ', err)
  }
}
