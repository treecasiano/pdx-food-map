<template>
  <div>
    <div v-if="tract.gid" class="text-center">
      <div class="title secondary--text">Census Tract No. {{tract.censustrac}}</div>
      <div class="subtitle-1 display-3 primary--text">{{tract.county_1}} County, {{tract.state_1}}</div>
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
        <div class="my-5">
          <div
            class="font-weight-black display-1 primary--text"
          >{{(tract.pop2010 / tract.area_sqmiles).toFixed(0)}}</div>
          <div class="font-weight-thin primary--text">People per Square Mile</div>
        </div>
      </div>
      <div v-if="tract.lilatrac_1">
        <span class="font-weight-black primary--text title">FOOD DESERT</span>
      </div>
      <div v-if="tract.hunvflag">
        <span class="font-weight-bold primary-text title">LOW VEHICLE ACCESS</span>
      </div>
      <div>
        <v-btn color="secondary" small rounded outlined class="mt-4" @click="clearSelectedTract">
          <v-icon class="mr-1">close</v-icon>Clear Tract Selection
        </v-btn>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center secondary--text">
        Portland-Vancouver-Hillsboro
        <br />Metropolitan Statistical Area
      </h1>
      <v-divider class="my-2"></v-divider>

      <div class="body-2 primary--text">
        Click on a census tract to learn more about food access indicators in the Portland Metro area.
        <v-flex class="ma-5">
          <v-layout align-center>
            <div class="pdx-legendSymbol--foodDesert"></div>
            <div class="font-weight-bold">Food Desert</div>
          </v-layout>
          <div class="my-2">
            More than 20%
            of households are low-income AND at least 33% live more than 1/2
            mile from the nearest supermarket.
          </div>
          <v-layout align-center>
            <div class="pdx-legendSymbol--lowVehicle"></div>
            <div class="font-weight-bold">Low Vehicle Access</div>
          </v-layout>
          <div class="mt-2">
            At least 100 households
            are more than ½ mile from the nearest
            supermarket and have no access to a vehicle.
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
