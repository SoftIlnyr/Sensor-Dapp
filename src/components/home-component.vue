<template>
  <div class="container"> 
    <div class="card card-outline-secondary my-5">
      <div class="card-header">
        <h4>Add sensor</h4>
        </div>
    <form @submit.prevent="addSensor" method="post">

      <div class="form-row">
        <div class="form-group col-md-5">
          <input type="text" v-model="sensorForm.name" class="form-control" placeholder="Sensor Name">
        </div>
        <div class="form-group col-md-3">
          <input type="text" v-model="sensorForm.type" class="form-control" placeholder="Sensor Type">
        </div>
        <select class="form-control col-md-4" v-model="sensorForm.period">
          <option v-for="option in periodOptions" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
        </div>
      <button class="btn" type="submit">Add</button>
    </form>
  </div>

<div class="my-5">
<button v-if="!orgSensors ||orgSensors.length === 0" class="btn" v-on:click="showOrgSensors">Show Sensors</button>
<button v-if="!sensorDatas || sensorDatas.length === 0" class="btn" v-on:click="showOrgSensorData">Show Sensor Data</button>
</div>

<div v-if="orgSensors && orgSensors.length > 0" class="card card-outline-secondary my-4">
<div class="card-header" >
<h4>Sensors</h4> 
 <small><a href="#" v-on:click="hideOrgSensors">Hide</a></small>
</div>
  <sensor-info v-for="sId in orgSensors" :key="sId" v-bind:id="sId"></sensor-info> 
</div>

<div v-if="sensorDatas.length > 0" class="card card-outline-secondary my-4">
<div class="card-header" >
<h4>Sensor Data</h4> 
 <small><a href="#" v-on:click="hideOrgSensorData">Hide</a></small>
</div>
<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Date Time</th>
        <th>Value</th>
        <th>Measure</th>
        <th>Sensor</th>
      </tr>
    </thead>
  <tbody>
      <tr v-for="sensorData in sensorDatas">
        <td>{{ sensorData.dateStr }}</td>
        <td>{{ sensorData.value}}</td>
        <td>ipsum</td>
        <td>dolor</td>
      </tr>
    </tbody>
  </table>
</div>
</div>

      </div>
</template>

<script>
import state from '../store/state'
import SensorInfo from '@/components/sensor-info'
const listSort = require('@/util/listSort')
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
        period: "Sensor Period"
      },
      periodOptions: [
        {text: "Daily", value: "DAILY"},
        {text: "Weekly", value: "WEEKLY"},
        {text: "Monthly", value: "MONTHLY"},
        {text: "Single", value: "SINGLE"}
      ],
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
      console.log(this.sensorForm.period)
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
    },
    hideOrgSensorData(event) {
      this.sensorDatas = []
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