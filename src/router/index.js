import Vue from 'vue'
import Router from 'vue-router'
import SensorDapp from '@/components/sensor-dapp'
import UserInfo from '@/components/user-info'
import AdminPage from '@/components/admin-page'

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
  }, ]
})