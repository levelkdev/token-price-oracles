module.exports = function uintToBytes32(num) {
  const hexString = num.toString(16)
  return padToBytes32(hexString)
}

function padToBytes32(n) {
    while (n.length < 64) {
        n = "0" + n;
    }
    return "0x" + n;
}
