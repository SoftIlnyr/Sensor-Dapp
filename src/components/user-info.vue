<template>
  <div>
    <h1>Hello</h1>
 <hello-metamask/>
</div>
</template>
<script>
import HelloMetamask from '@/components/hello-metamask'
export default {
  name: 'user-info',
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
<style scoped>
</style>
