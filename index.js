var express = require('express')
var routes = require('./routes')
var http = require('http')
var path = require('path')
var ECT = require('ect')
var app = express()

module.exports = app
app.set('port', process.env.PORT || 3003)

app.engine('ect', ECT({ watch: true, root: __dirname + '/views', ext: '.ect' }).render)
app.set('view engine', 'ect')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', routes.index)

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
})

//var bitcoin = require('bitcoinjs-lib')
//var key = bitcoin.ECKey.makeRandom()
//console.log('Private key: ' + key.toWIF())
//console.log('Address: ' + key.pub.getAddress().toString())

