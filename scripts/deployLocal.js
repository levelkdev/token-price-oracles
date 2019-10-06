const config = require('../src/config')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle
const network = process.argv[5]

const TOKEN_1 = '0x0000000000000000000000000000000000000001'
const TOKEN_2 = '0x0000000000000000000000000000000000000002'
                
module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts
  } = {}
) => {
  try {
    if (network !== 'rpc') throw new Error(`deployLocal can't be run on ${network}. Use "--network rpc"`)

    const TokenPriceDataFeedFactory = artifacts.require('TokenPriceDataFeedFactory')
    const ExchangeAdapterMock = artifacts.require('ExchangeAdapterMock')

    console.log(`Deploying exchangeAdapterMock...`)
    const exchangeAdapterMock = await ExchangeAdapterMock.new([TOKEN_1, TOKEN_2])
    console.log(`Deployed exchangeAdapterMock: ${exchangeAdapterMock.address}`)

    console.log(`Deploying tokenPriceDataFeedFactory...`)
    const tokenPriceDataFeedFactory = await TokenPriceDataFeedFactory.new(exchangeAdapterMock.address)
    console.log(`Deployed tokenPriceDataFeedFactory ${tokenPriceDataFeedFactory.address}`)

    console.log(`tokenPriceDataFeedFactory.createTokenPriceDataFeed(${TOKEN_1}, ${TOKEN_2})`)
    const receipt = await tokenPriceDataFeedFactory.createTokenPriceDataFeed(TOKEN_1, TOKEN_2)
    console.log('tokenPriceDataFeed: ', receipt.logs[0].args.tokenPriceDataFeed)

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    }
  } catch (err) {
    console.log('Error in scripts/deployLocal.js: ', err)
  }
}
