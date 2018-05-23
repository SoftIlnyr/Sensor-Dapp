<template>
  <div>
 	<home-component/>
</div>
</template>
<script>
import HomeComponent from '@/components/home-component'
import HelloMetamask from '@/components/hello-metamask'
export default {
  name: 'sensor-dapp',
  created () {
  	console.log("dapp")
  },
  components: {
    'home-component': HomeComponent,
    'hello-metamask': HelloMetamask
  }
}
</script>
</style>
