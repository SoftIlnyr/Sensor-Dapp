import Web3 from 'web3'
import {
    address,
    ABI
} //from './constants/sensorContract_actual'
from './constants/sensorContract'

let getContract = new Promise(function (resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider)
  let sensorContract = web3.eth.contract(ABI)
  let sensorContractInstance = sensorContract.at(address)
  console.log(sensorContract)
  console.log(sensorContractInstance)
  resolve(sensorContractInstance)
})

export default getContract
