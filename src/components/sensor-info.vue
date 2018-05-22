<template>
  <div class="card-body" v-if="sensor">
    <h3>{{ sensor.name }}</h3>
    <p><b>Measure: </b> {{ sensor.type }} </p>
    <p><b>Period: </b> {{ sensorTypes[sensor.period] }} </p>

  <div class="my-3" v-if="sensor.period === 3">
    <form @submit.prevent="addSensorData" method="post">
      <div class="form-group row">
      <label for="sensorValue" class="col-sm-2 col-form-label">Commit sensor data: </label>
      <div class="col-sm-3">
          <input name="sensorValue" class="form-control" v-model="sensorDataForm.value" placeholder="Sensor Value">     
      </div>
    </div>
      <button class="btn" type="submit">Add</button>
    </form>
  </div>


<button v-if="sensorDatas.length === 0" class="btn" v-on:click="showSensorData">Show Sensor Data</button>
<button class="btn" v-on:click="scheduleSensorData">Schedule Sensor Data</button>
<div v-if="sensorDatas.length > 0" class="card card-outline-secondary my-4">
<div class="card-header" >
<h4>Sensor Data</h4> 
 <small><a href="#" v-on:click="hideSensorData">Hide</a></small>
</div>
<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <th><a href="#" v-on:click="sortByDate">Date Time</a></th>
        <th><a href="#" v-on:click="sortByValue">Value</a></th>
      </tr>
    </thead>
  <tbody>
      <tr v-for="sensorData in sensorDatas">
        <td>{{ sensorData.dateStr }}</td>
        <td>{{ sensorData.value}}</td>
      </tr>
    </tbody>
  </table>
</div>
</div>

    <hr/>
</div>
</template>
<script>
import HelloMetamask from '@/components/hello-metamask'
import scheduleSensorData from '../util/scheduleSensorData'
const listSort = require('@/util/listSort')
export default {
  name: 'sensor-info',
  props: ['id'],
  data () {
    return {
      sensor: null,
      sensorDataForm: {
        value: null
      },
      sensorDatas: [],
      sortSd: {
        value: "asc",
        date: "desc"
      },
      sensorTypes: {
        0: "Daily",
        1: "Weekly",
        2: "Monthly",
        3: "Single"
      }
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
      let sensorDatas = this.sensorDatas
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
          sensorDatas = sensorDatas.sort(listSort.compareByDateDesc)
        }
      })


    },
    hideSensorData(event) {
      event.preventDefault()
      this.sensorDatas = []
    },
    sortByValue(event) {
      event.preventDefault()
      if (this.sortSd.value === "asc") {
        this.sensorDatas = this.sensorDatas.sort(listSort.compareByValueDesc)
        this.sortSd.value = "desc"
      } else {
        this.sensorDatas = this.sensorDatas.sort(listSort.compareByValueAsc)
        this.sortSd.value = "asc"
      }      
    },
    sortByDate(event) {
      event.preventDefault()
      if (this.sortSd.date === "asc") {
        this.sensorDatas = this.sensorDatas.sort(listSort.compareByDateDesc)
        this.sortSd.date = "desc"
      } else {
        this.sensorDatas = this.sensorDatas.sort(listSort.compareByDateAsc)
        this.sortSd.date = "asc"
      }  
    }
  }
}
</script>
<style scoped>
</style>
