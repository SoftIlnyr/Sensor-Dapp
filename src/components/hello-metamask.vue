<template>
  <div>
<nav class="navbar fixed-top navbar-expand-lg navbar-dark" style="background-color: #381360">
  <a class="navbar-brand" href="#">Sensor DApp</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>

    </ul>
  </div>
      <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle mr-sm-2" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ userInfo.firstname }} {{ userInfo.lastname}}
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <p class="dropdown-header"><b>Network:</b> {{ network }}</p>
          <p class="dropdown-header"><b>Account:</b> {{ coinbase }}</p>
          <p class="dropdown-header"><b>Balance:</b> {{ ethBalance }} Eth</p>
          <div class="dropdown-divider"></div>
          <p class="dropdown-header"><b>Organization:</b> {{ userInfo.organization.name }}</p>
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
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    network: state => NETWORKS[state.web3.networkId],
    coinbase: state => state.web3.coinbase,
    balance: state => state.web3.balance,
    ethBalance: state => {
      if (state.web3.web3Instance !== null) return state.web3.web3Instance().fromWei(state.web3.balance, 'ether')
    },
    userInfo: state => state.userInfo
  })
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
