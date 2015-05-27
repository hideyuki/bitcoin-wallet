var bitcoin = require('btc')

var key = bitcoin.ECKey.makeRandom()
console.log(key.toWIF())
