<template>
  <div>
    <div v-if="tract.gid" class="text-center">
      <div class="title display-3 primary--text">{{tract.county_1}} County, {{tract.state_1}}</div>
      <div class="subtitle-1 secondary--text">Selected Tract No. {{tract.censustrac}}</div>
      <v-divider class="my-2"></v-divider>
      <div class="body-1">
        <div class="my-5">
          <div class="font-weight-black display-1 primary--text">{{tract.povertyrat}}%</div>
          <div class="font-weight-thin">Poverty Rate</div>
        </div>
        <div class="my-5">
          <div
            class="font-weight-black display-1 primary--text"
          >{{formatCurrency(tract.medianfami)}}</div>
          <div class="font-weight-thin primary--text">Median Family Income</div>
        </div>
      </div>
      <div v-if="tract.lilatrac_1">
        <span class="font-weight-black primary--text">FOOD DESERT</span>
      </div>
      <div v-if="tract.hunvflag">
        <span class="font-weight-bold primary-text">LOW VEHICLE ACCESS</span>
      </div>
      <div>
        <v-btn
          small
          text
          class="my-2"
          color="secondary"
          @click="clearSelectedTract"
        >Clear Tract Selection</v-btn>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center">Portland-Vancouver-Hillsboro Metropolitan Statistical Area</h1>
      <v-divider class="my-2"></v-divider>

      <div>
        Zoom to any track by clicking on it and discover more about the tract's food environment.
        <v-flex>
          <v-layout align-center>
            <div class="pdx-legendSymbol--foodDesert"></div>
            <div>Food Desert</div>
          </v-layout>
          <v-layout align-center>
            <div class="pdx-legendSymbol--lowVehicle"></div>
            <div>Low Vehicle Access</div>
          </v-layout>
        </v-flex>
        <v-flex mt-2 class="text-xs-left">
          <div>
            <Strong>Food Desert</Strong>: a census tract where more than 20%
            of households are low-income AND at least 33% live more than 1/2
            mile (urban areas) or more than 10 miles (rural areas) from the
            nearest supermarket.
          </div>
          <div class="mt-2">
            <strong>Low Vehicle Access</strong>: a census tract where at
            least 100 households are more than ½ mile from the nearest
            supermarket and have no access to a vehicle;
            <em>or</em>, at
            least 500 people or 33 percent of the population live more than
            20 miles from the nearest supermarket, regardless of vehicle
            access.
          </div>
        </v-flex>
      </div>
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
    clearSelectedTract() {
      this.setTract({});
    },
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
