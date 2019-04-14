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
  props: {
    loading: Boolean,
    default: function () {
      return false;
    },
  }
}
</script>
