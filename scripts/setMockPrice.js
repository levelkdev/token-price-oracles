const config = require('../src/config')

const globalArtifacts = this.artifacts // Not injected unless called directly via truffle
const network = process.argv[5]
const exchangeMockAddress = process.argv[6]
const price = process.argv[7]

const TOKEN_1 = '0x0000000000000000000000000000000000000001'
const TOKEN_2 = '0x0000000000000000000000000000000000000002'
                
module.exports = async (
  truffleExecCallback,
  {
    artifacts = globalArtifacts
  } = {}
) => {
  try {
    if (network !== 'rpc') throw new Error(`setMockPrice can't be run on ${network}. Use "--network rpc"`)

    const ExchangeAdapterMock = artifacts.require('ExchangeAdapterMock')
    const exchangeAdapterMock = ExchangeAdapterMock.at(exchangeMockAddress)

    console.log(`setting mock price ${price*10**18} on ExchangeAdapterMock:<${exchangeMockAddress}>...`)
    await exchangeAdapterMock.setPriceForTokenPair(TOKEN_1, TOKEN_2, price*10**18)
    console.log('done')

    if (typeof truffleExecCallback === 'function') {
      truffleExecCallback()
    }
  } catch (err) {
    console.log('Error in scripts/setMockPrice.js: ', err)
  }
}
