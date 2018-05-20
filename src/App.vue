<template>
  <div id="app" class="container">
  	<hello-metamask/>
    <router-view/>
  </div>
</template>

<script>
import HelloMetamask from '@/components/hello-metamask'
export default {
  name: 'App',
    beforeCreate () {
    console.log('registerWeb3 Action dispatched from sensor-dapp.vue')
    let store = this.$store
    this.$store.dispatch('registerWeb3')
    this.$store.dispatch('getContractInstance')
    this.$store.dispatch('getUserInfo')
  },
  components: {
  	'hello-metamask': HelloMetamask
  }
}
</script>

<style>
.container {
 padding-right: 15px;
 padding-left: 15px;
 margin-right: auto;
 margin-left: auto;
}
@media (min-width: 768px) {
 .container {
 width: 750px;
 }
}
</style>
