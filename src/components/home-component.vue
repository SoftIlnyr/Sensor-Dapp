<template>
  <div class="sensor container"> 
     <p>Add organization: <input v-model="orgname" placeholder="Type name here">
    <button v-on:click="addOrganization">Submit</button></p>

    <p>Show organization: <input v-model="orgid" placeholder="Type org ID here">
    <button v-on:click="showOrganization">Submit</button>
    <div id="org1" class="event" v-if="organization">
      <p>Org ID: {{ organization._id }}</p>
      <p>Org Name: {{ organization._name }}</p>
      <p>Org Sensor Count: {{ organization._sensorCount }}</p>
    </div>
    <form @submit.prevent="addSensor" method="post">
      <h3>Add sensor</h3>
      <p>Sensor Name: <input v-model="sensor.name" name='sensorName' placeholder="Sensor Name"></p>
      <p>Sensor Type: <input v-model="sensor.type" name='sensorType' placeholder="Sensor Type"></p>
      <p>Sensor Period: <input v-model="sensor.period" name='sensorPeriod' placeholder="Sensor Period"></p>
      <input type="submit" value="Add">
    </form>

    <button v-on:click="showOrgSensors">Show Sensors</button>

    <div v-if="orgSensors && orgSensors.length > 0">
      <h3>Датчики</h3>
      <div v-for="sensor in orgSensors">
        <h4>{{sensor.name}}</h4> <p>{{sensor.type}}</p>     
      </div>
      <sensor-info v-for="sensor in orgSensors" :key="sensor.id" v-bind:id="sensor.id"></sensor-info>

    </div>

    <img v-if="pending" id="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif">
      </div>
</template>

<script>
import state from '../store/state'
import SensorInfo from '@/components/sensor-info'
export default {
  name: "home-component",
  data () {
    return {
      state: this.$store.state, 
      orgname: null,
      orgid: null,
      organization: null,
      pending: false,
      sensor: {
        name: null,
        type: null,
        period: null
      },
      orgSensors: [],
      test: "tes"
    }
  },
  methods: {
    addOrganization(event) {
      console.log('ADD ORGANIZATION WITH NAME ', this.orgname)
      let orgname = this.orgname
      this.pending = true
      this.$store.state.contractInstance().addOrganization(orgname, {
        gas: 300000,
        value: 0,
        from: this.$store.state.web3.coinbase
      }, (err,result) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Add org: success')
          this.pending = false
        }
      })
    },
    addSensor: function(e) {
      //e.preventDefault()
      this.pending = true
      let orgId = this.$store.state.userInfo.organization.id
      this.$store.state.contractInstance().addSensor(orgId, this.sensor.name, this.sensor.type, this.sensor.period, {
        gas: 300000,
        gwei: 1,
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
      //let orgId = 2
      console.log("getting by orgId: ", orgId)
      /*this.$store.state.contractInstance().getTestArray(orgId, 
        (err, result) => {
          if (err) {
            console.log(err)
            this.pending = false
          } else {
            console.log("got them!")
            console.log(result)
            this.orgSensors = result
            this.pending = false
          }
        })*/
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
              state.contractInstance().sensors(sId,
                (err, result) => {
                  if (err) {
                    console.log('get sensor err: ', err)
                  } else {
                    let orgSensor = {}
                    orgSensor.id = result[0]['c'][0]
                    orgSensor.name = result[1]
                    orgSensor.type = result[2]
                    orgSensor.period = result[3]['c'][0]
                    console.log(orgSensor)
                    console.log(orgSensors)
                    orgSensors.push(orgSensor)
                  }
                })
            })
            //this.orgSensors = result
            this.pending = false
          }
        })
      this.orgSensors = orgSensors

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