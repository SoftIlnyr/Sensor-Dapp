<template>
  <div>
    <hello-metamask/>
    <div>
      <ol class="breadcrumb">
      <li class="breadcrumb-item">
      <router-link to="/">Sensor DApp</router-link>
      </li>
        <li class="breadcrumb-item active">Sensor Data</li>
      </ol>
    </div>  
    <b-row>
      <b-col md="12">
        <b-card class="my-1"
        header-tag="header">
          <h4 slot="header" class="my-1">Sensor Data</h4>
          <b-card-body>
            <b-row>
              <b-col md="6" class="my-2">
                <b-form-group horizontal label="Per page" class="mb-0">
                  <b-form-select :options="pageOptions" v-model="perPage" />
                </b-form-group>
              </b-col>
              <b-col md="6" class="my-2">
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
              </b-col>
            </b-row>
            <b-table v-if="sensorDatas.length > 0" 
              striped 
              hover
              :items="sensorDatas"
              :fields="sensorDataFields"
              :current-page="currentPage"
              :per-page="perPage">
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
import state from '../store/state'
import SensorInfo from '@/components/sensor-info'
import HelloMetamask from '@/components/hello-metamask'
const listSort = require('@/util/listSort')
const contractUtils = require('@/util/contractUtils')
import
{
  address,
  ABI
}
from '../util/constants/sensorContract'

var rowCount = 0

export default
{
  name: "home-component",
  data()
  {
    return {
      state: this.$store.state,
      orgid: null,
      organization: null,
      sensorDatas: [],
      sensorDataFields: [
        {
          key: "date",
          label: "Date",
          sortable: true
        },
        {
          key: "value",
          label: "Value",
          sortable: true
        },
        {
          key: "sensor.type",
          label: "Measure"
        },
        {
          key: "sensor.name",
          label: "Sensor"
        }
      ],
      filter: null,
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [ 10, 20, 50 ] 
    }
  },
  watch: {
    sensorDatas:  {
      handler: function (val, oldVal) {
        this.totalRows = this.sensors.length      
      },
      deep: true
    }
  },
  created () {
      let state = this.$store.state
      let orgId = state.userInfo.organization.id
      let sensorDataList = []
      this.sensorDatas = sensorDataList
      contractUtils.getSensorsByOrganization(orgId).then(result => {      
        result.forEach(function(e) {
          contractUtils.getSensorInfo(e).then(result => {
            let sensor = result
            contractUtils.getSensorDataBySensor(sensor.id).then(result => {
              result.forEach(function(e) {
                contractUtils.getSensorDataInfo(e).then(result => {
                  let sensorData = result
                  sensorData.sensor = sensor
                  sensorDataList.push(sensorData)
                  sensorDataList.sort(listSort.compareByDateDesc)
                  rowCount = sensorDataList.length
                })                
              })
            })
          })
        })
      })
  },
  methods:
  {
    addAutoSensorData(event)
    {
      console.log('auto sensor data')
      let asd = new autoSensorData(0)
    }
  },
  components:
  {
    'sensor-info': SensorInfo,
    'hello-metamask': HelloMetamask
  }
}

</script>
