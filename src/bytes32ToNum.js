module.exports = function bytes32ToNum(bytes32str) {
  bytes32str = bytes32str.replace(/^0x/, '');
  while (bytes32str[0] == 0) {
    bytes32str = bytes32str.substr(1)
  }
  return parseInt('0x' + bytes32str)
}
