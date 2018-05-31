import state from '../store/state'

function scheduleSensorData(_sensorId, _sensorPeriod, _userPK) {
  //DAILY
	let period = 5 * 60 * 1000
  //let period = 1000
  //WEEKLY
  console.log(_sensorPeriod)
  if (_sensorPeriod === 1) {
    console.log("week")
    period *= 6
  }
  //MONTHLY
  if (_sensorPeriod === 2) {
    console.log("month")
    period *= 12
  }

  setInterval(() => {
    console.log("saving sensor data for sensor", _sensorId)
    var Tx = require('ethereumjs-tx')
    let value = Math.floor(Math.random() * 1000)
    let data = state.contractInstance().addSensorData.getData(_sensorId, value)
    let nonce = state.web3.web3Instance().eth.getTransactionCount(state.web3.coinbase,
    (err, nonce) => {
      console.log("nonce success")
      console.log(nonce)
      let privateKey = new Buffer(_userPK, 'hex')
      let tx = new Tx({
        nonce: nonce,
        gasPrice: web3.toHex(web3.toWei('1', 'gwei')),
        gasLimit: 300000,
        to: state.contractInstance().address,
        value: 0,
        data: data,
      });
      tx.sign(privateKey);
      console.log(tx)
      let serializedTx = tx.serialize()
      console.log(serializedTx)
      state.web3.web3Instance().eth.sendRawTransaction('0x' + serializedTx.toString('hex'),
        (err, hash) => {
          if (err) {
            console.log(err)
          } else {
            console.log(hash)
          }
      })
    })
  }, period)
}

export default scheduleSensorData