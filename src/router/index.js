import Vue from 'vue'
import Router from 'vue-router'
import SensorDapp from '@/components/sensor-dapp'
import UserInfo from '@/components/user-info'
import AdminPage from '@/components/admin-page'
import SensorComponent from '@/components/sensor-component'
import SensorDataComponent from '@/components/sensordata-component'
import SensorInfo from '@/components/sensor-info'
import HomeComponent from '@/components/home-component'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'sensor-dapp',
    component: SensorDapp
  }, {
    path: '/admin',
    name: 'admin-page',
    component: AdminPage
  }, {
  	path: '/sensors',
  	name: 'sensor-component',
  	component: SensorComponent
  }, {
  	path: '/sensor_data',
  	name: 'sensordata-component',
  	component: SensorDataComponent
  }, {
    path: '/sensors/:sensorId',
    name: 'sensor-info',
    component: SensorInfo
  }]
})