<template>
  <div>
    <h1>Hello Sensor! My id is {{ id }}</h1>
</div>
</template>
<script>
import HelloMetamask from '@/components/hello-metamask'
export default {
  name: 'sensor-info',
  props: ['id'],
  data () {
    return {
      sensor: null
    }
  }
}
</script>
<style scoped>
</style>
