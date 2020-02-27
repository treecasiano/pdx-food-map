<template>
  <div>
    <div v-if="tract.gid">
      <div class="title">{{tract.county_1}} County, {{tract.state_1}}</div>
      <div class="subtitle-1 secondary--text">Selected Tract No. {{tract.censustrac}}</div>
      <v-divider class="my-2"></v-divider>
      <div class="body-1">
        <div v-if="tract.lilatrac_1">
          <span class="font-weight-bold primary--text">FOOD DESERT</span>
        </div>
        <div v-if="tract.hunvflag">
          <span class="font-weight-bold primary-text">LOW VEHICLE ACCESS</span>
        </div>
        <div>
          <span class="font-weight-black">{{tract.povertyrat}}%</span> of households live in poverty.
        </div>
        <div>
          The median household income is
          <span
            class="font-weight-black"
          >{{formatCurrency(tract.medianfami)}}.</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="title text-center">Portland-Vancouver-Hillsboro Metropolitan Statistical Area</div>
      <v-divider class="my-2"></v-divider>

      <div>Click on a census tract to learn more about its food environment.</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "CensusTractProfile",
  computed: {
    ...mapState({
      tract: state => state.pdxTract.tract,
    }),
  },
  data() {
    return {};
  },
  methods: {
    formatCurrency(dollarValue) {
      // syntax numObj.toLocaleString([locales [, options]])
      return dollarValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      });
    },
    ...mapMutations({
      setTract: "pdxTract/setTract",
    }),
  },
};
</script>
<style>
</style>
