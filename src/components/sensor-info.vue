<template>
  <div v-if="sensor">
    <h3>{{ sensor.name }}</h3>
    <p>{{ sensor.type }} {{ sensor.period}} </p>
    <form v-if="sensor.period == 3" @submit.prevent="addSensorData" method="post">
      <p>Add sensor data:</p>
      <p>Sensor Value: <input name="sensorValue" v-model="sensorDataForm.value"></p>
      <input type="submit" value="Add">
    </form>
    <button v-on:click="showSensorData">Show Sensor Data</button>
        <button v-on:click="scheduleSensorData">Auto Sensor Data</button>
    <div v-if="sensorDatas.length > 0">
      <div v-for="sensorData in sensorDatas">
      {{ sensorData.dateStr }}: {{ sensorData.value}} {{ sensor.type}}
      </div>
    </div>
</div>
</template>
<script>
import HelloMetamask from '@/components/hello-metamask'
import scheduleSensorData from '../util/scheduleSensorData'
export default {
  name: 'sensor-info',
  props: ['id'],
  data () {
    return {
      sensor: null,
      sensorDataForm: {
        value: null
      },
      sensorDatas: []
    }
  },
  mounted () {
    console.log("my id is", this.id)
    this.$store.state.contractInstance().sensors(this.id,
      (err, result) => {
        if (err) {
          console.log('get sensor err: ', err)
        } else {
          this.sensor = {}
          this.sensor.id = result[0]['c'][0]
          this.sensor.name = result[1]
          this.sensor.type = result[2]
          this.sensor.period = result[3]['c'][0]
          console.log(this.sensor)
        }
      })
    },
  methods: {
    addSensorData: function(e) {
      console.log(this.$store.state.contractInstance())
      this.pending = true
      this.$store.state.contractInstance().addSensorData(this.sensor.id, this.sensorDataForm.value, {
        gas: 300000,
        gwei: 1,
        value: 0,
        from: this.$store.state.web3.coinbase
      },
        (err, result) => {
          if (err) {
            console.log(err)
            this.pending = false
          } else {
            console.log("sensor data added")
            this.pending = false
          }
        })
    },
    scheduleSensorData: function(event) {
      console.log('auto sensor data', this.sensor.id)
      let asd = new scheduleSensorData(this.sensor.id, this.sensor.period)
    },
    showSensorData: function(event) {
      this.pending = true
      let state = this.$store.state
      let sensorDatas = []
      console.log("show SD")
      state.contractInstance().getSensorDataBySensor(this.sensor.id, 
        (err, result) => {
          if (err) {
            console.log(err)
            this.pending = false
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
    } 
  }
}
</script>
<style scoped>
</style>
