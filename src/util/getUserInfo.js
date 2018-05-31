import Web3 from 'web3'
import {
  store
} from '../store/'

let getUserInfo = new Promise(function(resolve, reject) {
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)

  var setInt = setInterval(() => {
    if (web3 && store.state.contractInstance) {
      let promise = new Promise((resolve, reject) => {
        store.state.contractInstance().users(store.state.web3.coinbase,
          (err, result) => {
            if (err) {
              console.log(err)
            } else {
              let userInfo = {}
              userInfo.address = store.state.web3.coinbase,
              userInfo.firstname = result[0]
              userInfo.lastname = result[1]
              userInfo.role = result[2]["c"][0]
              userInfo.isActive = result[3]
              resolve(userInfo)
            }
          })
      }).then(result => {
        console.log("promise result")
        console.log(result)
        clearInterval(setInt)
        let userInfo = result
        let promiseOrg = new Promise((resolve, reject) => {
          store.state.contractInstance().organizationByUserAddress(store.state.web3.coinbase,
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                console.log("user org ", result)
                let orgInfo = {}
                orgInfo.id = result[0]["c"][0]
                orgInfo.name = result[1]
                resolve(orgInfo)
              }
            })
        }).then(result => {
          userInfo.organization = result
          //store.dispatch('pollUserInfo', pollUserInfo)
          resolve(userInfo)
        })
        //resolve(result)
      })
    }
  }, 500)

})

export default getUserInfo