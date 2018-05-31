<template>
  <div>
    <hello-metamask/>
<div>
<ol class="breadcrumb">
<li class="breadcrumb-item">
<router-link to="/">Sensor DApp</router-link>
</li>
<li class="breadcrumb-item active">Sensors</li>
</ol>
  </div>
  <div class="row">
    <div class="col-lg-12">
    <div class="card mb-3">
      <div class="card-header">
        <h4>Add sensor</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="addSensor"
              method="post">
          <div class="form-row">
            <div class="form-group col-md-5">
              <input type="text"
                     v-model="sensorForm.name"
                     class="form-control"
                     placeholder="Sensor Name">
            </div>
            <div class="form-group col-md-3">
              <input type="text"
                     v-model="sensorForm.type"
                     class="form-control"
                     placeholder="Sensor Type">
            </div>
            <select class="form-control col-md-4"
                    v-model="sensorForm.period">
              <option v-for="option in periodOptions"
                      v-bind:value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <button class="btn"
                  type="submit">Add</button>
        </form>
      </div>
    </div>
  </div>
  </div>

  <b-row>
    <b-col md="12">
      <b-card class="mb-3" 
        header-tag="header">
        <h4 slot="header" class="mb-0">Sensors</h4>
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
          <b-table striped 
            hover 
            :items="sensors" 
            :fields="sensorFields"
            :per-page="perPage"
            :current-page="currentPage">
            <template slot="name" slot-scope="row" sortable>{{ row.item.name }}</template>
            <template slot="type" slot-scope="row">{{ row.item.type }}</template>
            <template slot="period" slot-scope="row">{{ periodOptions[row.item.period].text }}</template>
            <template slot="actions" slot-scope="row">
              <b-button size="sm" @click.stop="toggleSensorData(row.item); row.toggleDetails();" class="mr-2">
               {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
              </b-button>
              <router-link :to="{ name: 'sensor-info', params: { sensorId: row.item.id }}" >
                <b-button size="sm" >
                More Info
              </b-button></router-link>
            </template>
            <template slot="row-details" slot-scope="row">
              <b-card>
                <b-row>
                  <b-col md="6"></b-col>
                  <b-col md="6">
                    <b-table striped small
                      :items="row.item.sensorData"
                      :fields="sensorDataFields">
                      <template slot="date" slot-scope="sdRow">{{ sdRow.item.date.toLocaleDateString() + " " + sdRow.item.date.toLocaleTimeString() }}</template>

                    </b-table>
                  </b-col>
                </b-row>
              </b-card>
            </template>
          </b-table>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>

  </div>
</div>
</template>
<script>
import state from '../store/state'
import SensorInfo from '@/components/sensor-info'
import HelloMetamask from '@/components/hello-metamask'
import
{
  address,
  ABI
}
from '../util/constants/sensorContract'

const listSort = require('@/util/listSort')
const contractUtils = require('@/util/contractUtils')

export default
{
  name: "sensor-component",
  created () {
    console.log("sensor alive")
    this.showOrgSensors()
  },
  data()
  {
    return {
      state: this.$store.state,
      userInfo: this.$store.state.userInfo,
      orgid: null,
      organization: null,
      pending: false,
      periodOptions: contractUtils.periodOptions,
      sensorForm:
      {
        name: "",
        type: "",
        period: ""
      },
      sensors: [],
      sensorFields: [
        {
          key: "name",
          label: "Name",
          sortable: true,
          sortDirection: "Asc"
        },
        {
          key: "type",
          label: "Measure"
        },
        {
          key: "period",
          label: "Period"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      sensorDataFields: [
        {
          key: "date",
          label: "Date"
        },
        {
          key: "value",
          label: "Value",
          sortable: true
        }
      ],
      perPage: 5,
      pageOptions: [5, 10, 20],
      currentPage: 1,
      totalRows: 0
    }
  },
  watch: {
    sensors:  {
      handler: function (val, oldVal) {
        this.totalRows = this.sensors.length      
      },
      deep: true
    }
  },
  methods:
  {
    addSensor: function(e)
    {
      let orgId = this.$store.state.userInfo.organization.id
      contractUtils.addSensor(orgId, this.sensorForm.name, this.sensorForm.type, this.sensorForm.period).then(result => {
          console.log(result)
      })
    },

    addAutoSensorData(event)
    {
      console.log('auto sensor data')
      let asd = new autoSensorData(0)
    },
    showOrgSensors: function(event)
    {
      let orgId = this.$store.state.userInfo.organization.id
      
      console.log("getting by orgId: ", orgId)
      contractUtils.getSensorsByOrganization(orgId).then(result => {
        new Promise(function(resolve, reject) {
          let resultList = []
          result.forEach(function(element) {
            contractUtils.getSensorInfo(element).then(result => {
              resultList.push(result)
            })
          })
          let int = setInterval(function() {
            if (resultList.length === result.length) {
              clearInterval(int)
              resolve(resultList)
            }
          })
        }).then(result => {
          this.sensors = result.sort(listSort.compareByNameAsc)
        })
      })
    },
    toggleSensorData: function(sensor) {
      let state = this.$store.state
      contractUtils.getSensorDataBySensor(sensor.id).then(result => {        
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
          sensor.sensorData = result.sort(listSort.compareByDateDesc).slice(0, 5)
        })
      })
    }
  },
  components:
  {
    'sensor-info': SensorInfo,
    'hello-metamask': HelloMetamask
  }
}

</script>
</template>