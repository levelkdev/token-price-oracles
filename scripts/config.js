const fs = require('fs')
const isLocalNetwork = require('./isLocalNetwork')

module.exports = function configForEnv (network) {
  if (isLocalNetwork(network)) {
    return defaultConf('rpc')
  } else {
    return readDeployConfig(network) || defaultConf(network)
  }
}

function readDeployConfig (network) {
  try {
    let conf = JSON.parse(fs.readFileSync(`conf.${network}.json`))
    return conf
  } catch (err) {
    console.log(`No existing ${network}.json file found:`, err)
  }
}

function defaultConf (network) {
  // TODO: handle local default
  return { }
}
