import state from '../store/state'

export var periodOptions = [
	{
  	text: "Daily",
  	value: "DAILY"
  },
  {
  	text: "Weekly",
		value: "WEEKLY"
	},
	{
		text: "Monthly",
		value: "MONTHLY"
	},
	{
		text: "Single",
		value: "SINGLE"
	}]

export var roleOptions = [
	{
		text: "Admin",
		value: "ADMIN"
	},
	{
		text: "Org Admin",
		value: "ORGADMIN"
	},
	{
		text: "Org User",
		value: "ORGUSER"
	}]

export function checkUserAccess(uAddress) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().owner((err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

export function getOwner() {
	return new Promise(function(resolve, reject) {
		state.contractInstance().owner((err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}

export function getUserInfo(uAddress) {
	new Promise(function(resolve, reject) {
		state.contractInstance().users(uAddress,
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					let userInfo = {}
					userInfo.firstName = result[0]
					userInfo.lastName = result[1]
					userInfo.role = result[2]['c'][0]
					userInfo.isActive = result[3]
					resolve(userInfo)
				}
			})
	})
}

function getUserOrg(uAddress) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().organizationByUserAddress(uAddress,
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					if (result[1].length === 0) {
						resolve(null)
					} else {
						let org = {}
						org.name = result[1]
						org.id = result[0]['c'][0]
						resolve(org)
					}
				}
			})
	})
}

function getUserInfo(uAddress) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().users(uAddress,
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					let userInfo = {}
					userInfo.address = uAddress
					userInfo.firstName = result[0]
					userInfo.lastName = result[1]
					userInfo.role = result[2]['c'][0]
					userInfo.isActive = result[3]
					getUserOrg(uAddress).then(result => {
						userInfo.organization = result
					})
					console.log(userInfo)
					resolve(userInfo)
				}
			})
	})
}

function getUserAddress(uId) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().userAddresses(uId,
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
	})
}


export function getUsers() {
	return new Promise(function(resolve, reject) {
		state.contractInstance().getUserCount((err, result) => {
			if (err) {
				reject(err)
			} else {
				let userCount = result['c'][0]
				let resultList = []
				for (let i = 0; i < userCount; i++) {
					getUserAddress(i).then(result => {
						getUserInfo(result).then(result => {
							resultList.push(result)
						})						
					})
				}
				let int = setInterval(function() {
					if (resultList.length === userCount) {
						clearInterval(int)
						resolve(resultList)
					}
				}, 100)				
			}
		})
	})
}

function getOrgInfo(orgId) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().organizations(orgId,
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					let orgInfo = {}
					orgInfo.id = result[0]['c'][0]
					orgInfo.name = result[1]
					orgInfo.sensorCount = result[2]['c'][0]
					resolve(orgInfo)
				}
			})
	})
}

export function getOrganizations() {
	return new Promise(function(resolve, reject) {
		state.contractInstance().getOrganizationCount((err, result) => {
			if (err) {
				reject(err)
			} else {
				let orgCount = result['c'][0]
				let resultList = []
				for (let i = 0; i < orgCount; i++) {
					getOrgInfo(i).then(result => {
						resultList.push(result)
					})
				}
				let int = setInterval(function() {
					if (resultList.length === orgCount) {
						clearInterval(int)
						resolve(resultList)
					}
				}, 100)
			}
		})
	})
}


export function addOrganization(orgName) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().addOrganization(orgName, {
        gas: 300000,
        gasPrice: web3.toWei(1, 'gwei'),
        value: 0,
        from: state.web3.coinbase
      }, (err, result) => {
      	if (err) {
      		reject(err)
      	} else {
      		resolve(result)
      	}
      })
	})
}

export function getSensorsByOrganization(orgId) {
  return new Promise(function(resolve, reject) {
    state.contractInstance().getSensorsByOrganization(orgId,
      (err, result) => {
      	if (err) {
      		reject(err)
      	} else {
      		let resultList = []
      		result.forEach(function(element) {
      			resultList.push(element['c'][0])
      		})
      		resolve(resultList)
      	}
      })
  })
}

export function getSensorInfo(sensorId) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().sensors(sensorId, 
			(err, result) => {
				if (err) {
					reject(err)
				} else {
          let sensor = {}
          sensor.id = result[0]['c'][0]
          sensor.name = result[1]
          sensor.type = result[2]
          sensor.period = result[3]['c'][0]
          resolve(sensor)
				}
			})
	})
}

export function getSensorDataBySensor(sensorId) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().getSensorDataBySensor(sensorId, 
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					let resultList = []
					result.forEach(function(element) {
						resultList.push(element['c'][0])
					})
					resolve(resultList)
				}
			})
	})
}

export function getSensorDataInfo(sdId) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().sensorData(sdId, 
			(err, result) => {
				if (err) {
					reject(err)
				} else {
          let sensorData = {}
					sensorData.id = result[0]['c'][0]
          sensorData.value = result[1]['c'][0]
          sensorData.date = result[2]['c'][0]
          sensorData.date = new Date(sensorData.date * 1000)
          resolve(sensorData)
				}
			})
	})
}

export function addSensor(orgId, sName, sType, sPeriod) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().addSensor(orgId, sName, sType, sPeriod,
      {
        gas: 300000,
        gasPrice: web3.toWei(1, 'gwei'),
        value: 0,
        from: state.web3.coinbase
      },
			(err, result) => {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
	})
}

export function commitSensorData(sensorId, value) {
	return new Promise(function(resolve, reject) {
		state.contractInstance().addSensorData(sensorId, value, {
			gas: 300000,
			gasPrice: web3.toWei(1, 'gwei'),
			value: 0,
			from: state.web3.coinbase
		}, (err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
}