<template>
  <div style="height: 95vh; width: 100%">
    <main-map></main-map>
  </div>
</template>

<script>
// @ is an alias to /src
import MainMap from '@/components/MainMap.vue'

export default {
  name: 'home',
  components: {
    MainMap
  },
  async created() {
    await this.$store.dispatch("groceryStore/getGroceryStoreGeoJSON");
    await this.$store.dispatch("pdxTract/getPdxTractGeoJSON");
  },
}
</script>
