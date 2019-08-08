const config = require('./config')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle
const network = process.argv[5]

module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts
  } = {}
) => {
  try {
    const UniswapAdapter = artifacts.require('UniswapAdapter')
    const TokenPriceDataFeedFactory = artifacts.require('TokenPriceDataFeedFactory')
    const { uniswapFactory } = config(network)

    console.log(`Deploying to "${network}" network`)
    console.log('')

    console.log(`Deploying uniswapAdapter...`)
    const uniswapAdapterContract = await UniswapAdapter.new(uniswapFactory)
    console.log(`Deployed: ${uniswapAdapterContract.address}`)
    console.log(``)

    console.log(`Deploying tokenPriceDataFeedFactory...`)
    const tokenPriceDataFeedFactory = await TokenPriceDataFeedFactory.new(
      uniswapAdapterContract.address
    )
    console.log(`Deployed: ${tokenPriceDataFeedFactory.address}`)
    console.log(``)

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    } else {
      return {
        uniswapAdapterAddress: uniswapAdapter.address
      }
    }
  } catch (err) {
    console.log('Error in scripts/deploy.js: ', err)
  }
}
