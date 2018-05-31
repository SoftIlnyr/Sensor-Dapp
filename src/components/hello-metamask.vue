<template>
  <div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav" style="background-color: #381360">
    <router-link to="/" class="navbar-brand" href="index.html">Sensor DApp</router-link>
    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarResponsive">
      <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">
        <li v-if="userInfo.isActive && (userInfo.role === 0 || userInfo.role === 1)" class="nav-item" data-toggle="tooltip" data-placement="right" title="Dashboard">
          <router-link to="/admin" class="nav-link" href="#">
            <i class="fa fa-fw fa-dashboard"></i>
            <span class="nav-link-text">Admin</span>
          </router-link>
        </li>
        <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Charts">
          <router-link to="/sensors" class="nav-link">
            <i class="fa fa-fw fa-table"></i>
            <span class="nav-link-text">Sensors</span>
          </router-link>
        </li>
        <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Tables">
          <router-link to="/sensor_data" class="nav-link" href="tables.html">
            <i class="fa fa-fw fa-table"></i>
            <span class="nav-link-text">Sensor Data</span>
          </router-link>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown">
        <a v-if="userInfo" class="nav-link dropdown-toggle mr-sm-2" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ userInfo.firstname }} {{ userInfo.lastname}}
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <p class="dropdown-header"><b>Network:</b> {{ network }}</p>
          <p class="dropdown-header"><b>Account:</b> {{ coinbase }}</p>
          <p class="dropdown-header"><b>Balance:</b> {{ ethBalance }} Eth</p>
          <div class="dropdown-divider"></div>
          <p v-if="userInfo" class="dropdown-header"><b>Organization:</b> {{ userInfo.organization.name }}</p>
        </div>
      </li>
      </ul>
    </div>
  </nav>
  </div>
</template>

<script>
import {NETWORKS} from '../util/constants/networks'
import {mapState} from 'vuex'
export default {
  name: 'hello-metamask',
  mounted () {
    console.log("hello metamask")
  },
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    network: state => NETWORKS[state.web3.networkId],
    coinbase: state => state.web3.coinbase,
    balance: state => state.web3.balance,
    ethBalance: state => {
      if (state.web3.web3Instance !== null) return state.web3.web3Instance().fromWei(state.web3.balance, 'ether')
    },
    userInfo: state => state.userInfo
  }),
  methods: {
    showSensors(event) {
      console.log("show sensors")
      console.log(this.$parent)
    }
  }
}
</script>

<style scoped>
.metamask-info {
  text-align:center;
}
#has-metamask {
  color: green;
}
#no-metamask {
  color:red;
}</style>
