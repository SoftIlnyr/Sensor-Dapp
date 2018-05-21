<template>
  <div class="sensor container"> 


    <p>Show organization: <input v-model="orgid" placeholder="Type org ID here">
    <button v-on:click="showOrganization">Submit</button>
    <div id="org1" class="event" v-if="organization">
      <p>Org ID: {{ organization._id }}</p>
      <p>Org Name: {{ organization._name }}</p>
      <p>Org Sensor Count: {{ organization._sensorCount }}</p>
    </div>
    <form @submit.prevent="addSensor" method="post">
      <h3>Add sensor</h3>
      <p>Sensor Name: <input v-model="sensorForm.name" name='sensorName' placeholder="Sensor Name"></p>
      <p>Sensor Type: <input v-model="sensorForm.type" name='sensorType' placeholder="Sensor Type"></p>
      <p>Sensor Period: <input v-model="sensorForm.period" name='sensorPeriod' placeholder="Sensor Period"></p>
      <input type="submit" value="Add">
    </form>

    <button v-on:click="showOrgSensors">Show Sensors</button>
    <button v-on:click="hideOrgSensors">Hide Sensors</button>

    <div v-if="orgSensors && orgSensors.length > 0">
      <h3>Датчики</h3>
      <div v-for="sensor in orgSensors">
        <h4>{{sensor.name}}</h4> <p>{{sensor.type}}</p>     
      </div>
      <sensor-info v-for="sId in orgSensors" :key="sId" v-bind:id="sId"></sensor-info>
    </div>

    <button v-on:click="showOrgSensorData">Show Sensor Data</button>
    <div v-if="sensorDatas.length > 0">
      <div v-for="sensorData in sensorDatas">
      {{ sensorData.dateStr }}: {{ sensorData.value}}
      </div>
    </div>

    <img v-if="pending" id="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif">
      </div>
</template>

<script>
import state from '../store/state'
import SensorInfo from '@/components/sensor-info'
import {
    address,
    ABI
} 
from '../util/constants/sensorContract'
export default {
  name: "home-component",
  data () {
    return {
      state: this.$store.state, 
      orgname: null,
      orgid: null,
      organization: null,
      pending: false,
      sensorForm: {
        name: null,
        type: null,
        period: null
      },
      orgSensors: [],
      test: "tes",
      sensorDatas: []
    }
  },
  methods: {
    addSensor: function(e) {
      //e.preventDefault()
      this.pending = true
      let orgId = this.$store.state.userInfo.organization.id
      console.log("think ok")
      //this.$store.state.contractInstance().addSensor.getData()
      this.$store.state.contractInstance().addSensor(orgId, this.sensorForm.name, this.sensorForm.type, this.sensorForm.period, {
        gas: 300000,
        gasPrice: web3.toWei(1, 'gwei'),
        value: 0,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
          this.pending = false
        } else {
          console.log("Sensor added")
          this.pending = false
        }
      })
    },
    addAutoSensorData(event) {
      console.log('auto sensor data')
      let asd = new autoSensorData(0)
    },
    showOrganization(event) {
      let orgId = this.orgid
      console.log(this.orgid)
      this.pending = true
      this.$store.state.contractInstance().organizations(this.orgid,
        (err, result) => {
          if (err) {
            console.log(err)
            this.pending = false
          } else {
            this.organization = result
            this.organization._id = result[0]["c"][0]
            this.organization._name = result[1]
            this.organization._sensorCount = result[2]["c"][0]
            console.log(this.organization)
            this.pending = false
          }
        })
      console.log(this.Org)
    },
    showOrgSensors: function(event) {
      let state = this.$store.state
      this.pending = true
      let orgId = state.userInfo.organization.id
      let orgSensors = []
      console.log("getting by orgId: ", orgId)
      state.contractInstance().getSensorsByOrganization(orgId, 
        (err, result) => {
          if (err) {
            console.log(err)
            this.pending = false
          } else {
            //orgSensors = this.orgSensors
            console.log("got them!")
            console.log(result)
            result.forEach(function(element) {
              let sId = element['c'][0]
              console.log(sId) 
              orgSensors.push(sId)
            })
            //this.orgSensors = result
            this.pending = false
          }
        })
      this.orgSensors = orgSensors
    },
    showOrgSensorData(event) {
      let state = this.$store.state
      let orgId = state.userInfo.organization.id
      let sensorDatas = []
      console.log("show org SD")
      state.contractInstance().getSensorDataByOrganization(orgId, 
        (err, result) => {
          if (err) {
            console.log(err)
          } else {
            result.forEach(function(element) {
              let sdId = element['c'][0]
              state.contractInstance().sensorData(sdId,
                (err, result) => {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log(result)
                    let sensorData = {}
                    sensorData.id = result[0]['c'][0]
                    sensorData.value = result[1]['c'][0]
                    sensorData.date = result[2]['c'][0]
                    sensorData.date = new Date(sensorData.date * 1000)
                    var options = {  
                        weekday: "long", year: "numeric", month: "short",  
                        day: "numeric", hour: "2-digit", minute: "2-digit"  
                    };  
                    sensorData.dateStr = sensorData.date.toLocaleDateString() + " " + sensorData.date.toLocaleTimeString()
                    sensorDatas.push(sensorData)
                  }
                })
            })
          }
        })
      this.sensorDatas = sensorDatas
    },
    hideOrgSensors(event) {
      this.orgSensors = []
    }

  },
  mounted () {
    //console.log('dispatching getContractInstance')
    //this.$store.dispatch('getContractInstance')
    /*this.$store.state.contractInstance().users(coinbase, 
      (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(result)
          this.userInfo = result
        }
      })*/
  },
  components: {
    'sensor-info': SensorInfo
  }
}
</script>