<template>
  <div>
    <hello-metamask/>
    <div>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Sensor DApp</router-link>
        </li>
        <li class="breadcrumb-item active"><router-link to="/sensors">Sensors</router-link></li>
        <li v-if="sensor" class="breadcrumb-item active">{{ sensor.name }}</li>
      </ol>
    </div>
    <b-row v-if="sensor">
      <b-col md="5">
        <b-card class="mb-3" header-tag="header">
          <h4 slot="header" class="mb-0">{{sensor.name}}</h4>
          <b-card-body>
            <p><b>Measure: </b> {{ sensor.type }} </p>
            <p><b>Period: </b> {{ sensorTypes[sensor.period] }} </p>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col md="7">
        <b-card v-if="sensor.period !== 3" class="mb-3" header-tag="header">
          <h4 slot="header" class="mb-0">Schedule</h4>
          <b-card-body>
            <b-form @submit="scheduleSensorData">
              <b-form-group horizontal label="User Private Key">
                <b-form-input v-model="sensorDataForm.userPK" placeholder="Private Key">

                </b-form-input>
              </b-form-group>
              <b-button type="submit">Schedule</b-button>
            </b-form>
          </b-card-body>
        </b-card>
        <b-card v-if="sensor.period === 3" class="mb-3" header-tag="header">
          <h4 slot="header" class="mb-0">Commit Data</h4>
          <b-card-body>
            <b-form @submit="commitSensorData">
              <b-form-group horizontal label="Value" >
                <b-form-input v-model="sensorDataForm.value" placeholder="Value">

                </b-form-input>
              </b-form-group>
              <b-button type="submit">Commit</b-button>
            </b-form>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-card class="my-1"
        header-tag="header">
          <h4 slot="header" class="my-1">Sensor Data</h4>
          <b-card-body>
            <b-row>
              <b-col md="6" class="my-2">
                <b-form-group horizontal label="Per page" class="mb-0">
                  <b-form-select :options="sensorDataTable.pageOptions" v-model="sensorDataTable.perPage" />
                </b-form-group>
              </b-col>
              <b-col md="6" class="my-2">
                <b-pagination :total-rows="sensorDataTable.totalRows" :per-page="sensorDataTable.perPage" v-model="sensorDataTable.currentPage" class="my-0" />
              </b-col>
            </b-row>
            <b-table v-if="sensorData.length > 0" 
              striped 
              hover
              :items="sensorData"
              :fields="sensorDataTable.fields"
              :current-page="sensorDataTable.currentPage"
              :per-page="sensorDataTable.perPage">
              <template slot="date" slot-scope="data">
              {{data.item.date.toLocaleDateString() + " " + data.item.date.toLocaleTimeString()}}
              </template>
              <template slot="value" slot-scope="data">
              {{data.item.value}}
              </template>
            </b-table>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>  
  </div>
</template>

<script>
import HelloMetamask from '@/components/hello-metamask'
import scheduleSensorData from '../util/scheduleSensorData'
const contractUtils = require('@/util/contractUtils')
const listSort = require('@/util/listSort')
export default {
  name: 'sensor-info',
  props: ['id'],
  data () {
    return {
      sensor: null,
      sensorData: [],
      sensorDataForm: {
        value: null,
        userPK: null
      },
      sensorTypes: {
        0: "Daily",
        1: "Weekly",
        2: "Monthly",
        3: "Single"
      },
      sensorDataTable: {
        fields: [
          {
            key: "date",
            label: "Date",
            sortable: true
          },
          {
            key: "value",
            label: "Value",
            sortable: true
          }
        ],
        currentPage: 1,
        perPage: 10,
        pageOptions: [10, 20, 50],
        totalRows: 0
      }
    }
  },
  watch: {
    sensorData: {
      handler: function(val, oldVal) {
        this.sensorDataTable.totalRows = this.sensorData.length
      }
    }
  },  
  created () {
    let sId = this.$route.params.sensorId
    contractUtils.getSensorInfo(sId).then(result => {
      this.sensor = result
    })
    this.showSensorData()
  },
  methods: {
    commitSensorData: function(event) {
      contractUtils.commitSensorData(this.sensor.id, this.sensorDataForm.value).then(result => {
        console.log(result)
      })
    },
    scheduleSensorData: function(event) {
      console.log("Schedule")
      let sSD = new scheduleSensorData(this.sensor.id, this.sensor.period, this.sensorDataForm.userPK)
    },
    showSensorData: function(e) {
      let state = this.$store.state
      let sId = this.$route.params.sensorId
      contractUtils.getSensorDataBySensor(sId).then(result => {        
        new Promise(function(resolve, reject) {
          let resultList = []
          result.forEach(function(element) {
            contractUtils.getSensorDataInfo(element).then(result => {
              resultList.push(result)
            })
          })
          let int = setInterval(function() {
            if (resultList.length === result.length) {
              clearInterval(int)
              resolve(resultList)
            }
          }, 50)
        }).then(result => {
          console.log(result)
          this.sensorData = result.sort(listSort.compareByDateDesc)
        })
      })

    },
  },
  components: {
    'hello-metamask': HelloMetamask
  }
}
</script>
<style scoped>
</style>
