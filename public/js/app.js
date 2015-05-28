var privateKey, address;
var unspents;

var BITCOIN_API_BASE_URL = "http://btc.blockr.io/api/v1"


/*********************************
 * User info
 *********************************/

function isValidPrivateKey(key){
  return key[0]=="L" || key[0]=="K"
}

function showUserInfo(key){
  privateKey = key.toWIF()
  address = key.getAddress().toString()

  $("#private_key").html(privateKey)
  $("#address").html(address)
}


/**********************************
 * Balance
 **********************************/

function addBalanceData(unspent){
  var $table = $("#balance_table")
  var $tr = $("<tr />")
  $tr.append($("<td />").html($table.children().length))
  $tr.append($("<td />").html(unspent.amount))
  $tr.append($("<td />").html(unspent.amount * 100000000))
  $tr.append($("<td />").html(unspent.tx))

  $table.append($tr)

  console.log(unspent)
}


/************************************
 * Transaction
 ************************************/

function sendBTC(destAddress, satoshi){
  var tx = new bitcoin.TransactionBuilder()

  _.map(unspents, function(unspent){
    tx.addInput(unspent.tx, unspent.n)
  })
  tx.addOutput(destAddress, satoshi)

  var key = bitcoin.ECPair.fromWIF(privateKey)
  _.map(unspents, function(unspent){
    tx.sign(unspent.n, key)
  })

  var data = {
    hex: tx.build().toHex()
  }

  $.ajax({
    type: "post",
    url: BITCOIN_API_BASE_URL + "/tx/push",
    data: data
  })
    .then(function(res){
      console.log(res)
    })
}


/***********************************
 * Main
 ***********************************/

$(function(){
  $("#generate").click(function(){
    var key = bitcoin.ECPair.makeRandom()
    showUserInfo(key)
  })

  $("#exist_private_key").click(function(){
    var a = $("#your_private_key").val()
    if(a.length>0 && isValidPrivateKey(a)){
      var key = bitcoin.ECPair.fromWIF(a)
      showUserInfo(key)
    }
    else {
      alert("error")
    }
  })

  $("#get_your_balance").click(function(){
    $.getJSON(BITCOIN_API_BASE_URL + "/address/unspent/" + address + "?unconfirmed=1")
      .then(function(res){
        console.log(res)

        unspents = res.data.unspent

        if(unspents.length>0){
          _.map(unspents, function(unspent){
            addBalanceData(unspent)
          })
        }
      })
  })

  $("#send_btc").click(function(){
    var destAddress = $("#dest_address").val()
    var satoshi = parseInt($("#satoshi").val())

    sendBTC(destAddress, satoshi)
  })

})
