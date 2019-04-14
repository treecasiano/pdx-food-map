<template>
  <div style="height: inherit; width: 100%">
    <main-map :loading="loading"></main-map>
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
    this.loading = true;
    await this.$store.dispatch("farmersMarket/getFarmersMarketGeoJSON");
    await this.$store.dispatch("groceryStore/getGroceryStoreGeoJSON");
    await this.$store.dispatch("pdxTract/getPdxTractGeoJSON");
    this.loading = false;
  },
  data() {
    return {
      loading: false
    }
  },
}
</script>
