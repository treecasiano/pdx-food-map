<template>
  <div>
    <div v-if="tract.gid" class="text-center">
      <h1 class="secondary--text">Census Tract No. {{ tract.censustrac }}</h1>
      <div class="primary--text">{{ tract.county_1 }} County, {{ tract.state_1 }}</div>
      <v-divider class="my-2"></v-divider>
      <div>
        <div class="my-5">
          <div class="font-weight-black pdx-tract-stats primary--text">{{ tract.povertyrat }}%</div>
          <div class="font-weight-thin primary--text">Poverty Rate</div>
        </div>
        <div class="my-5">
          <div
            class="font-weight-black pdx-tract-stats primary--text"
          >{{ formatCurrency(tract.medianfami) }}</div>
          <div class="font-weight-thin primary--text">Median Family Income</div>
        </div>
        <div class="my-5">
          <div
            class="font-weight-black pdx-tract-stats primary--text"
          >{{ (tract.pop2010 / tract.area_sqmiles).toFixed(0) }}</div>
          <div class="font-weight-thin primary--text">People per Square Mile</div>
        </div>
      </div>
      <div class="my-5">
        <div class="font-weight-black pdx-tract-stats primary--text">{{ tract.pop2010 }}</div>
        <div class="font-weight-thin primary--text">Total Tract Population</div>
      </div>
      <div>
        <span class="font-weight-black secondary--text title">
          {{
          tract.urban ? "URBAN" : "RURAL"
          }}
        </span>
      </div>
      <div v-if="tract.lilatrac_1">
        <span class="font-weight-black tertiary--text title">FOOD DESERT</span>
      </div>
      <div v-if="tract.hunvflag">
        <span class="font-weight-bold tertiary--text title">LOW VEHICLE ACCESS</span>
      </div>
      <div>
        <v-btn color="secondary" small text class="mt-4" @click.stop="clearSelectedTract">
          <v-icon class="mr-1">close</v-icon>Clear Tract Selection
        </v-btn>
      </div>
      <div
        class="mt-5 primary--text overline pdx-tract__text--dataSource"
      >USDA ERS Food Access Research Atlas 2015</div>
      <div class="primary--text overline pdx-tract__text--dataSource">US Census 2010</div>
    </div>
    <div v-else>
      <h1 class="text-center secondary--text">
        Portland-Vancouver-Hillsboro
        <br />Metropolitan Statistical Area
      </h1>
      <v-divider class="my-2"></v-divider>

      <div class="primary--text">
        Click on a census tract to learn more about food access indicators in
        the Portland Metro area.
        <v-flex class="ma-5">
          <v-layout align-center>
            <div class="pdx-legendSymbol--foodDesert"></div>
            <div class="font-weight-bold">Food Desert</div>
          </v-layout>
          <div class="my-2">
            More than 20% of households are low-income AND at least 33% live
            more than 1/2 mile from the nearest supermarket.
          </div>
          <v-layout align-center>
            <div class="pdx-legendSymbol--lowVehicle"></div>
            <div class="font-weight-bold">Low Vehicle Access</div>
          </v-layout>
          <div class="mt-2">
            At least 100 households are more than ½ mile from the nearest
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
.pdx-tract-stats {
  font-size: 1.2em;
}

.pdx-tract__text--dataSource {
  display: none;
}

@media screen and (min-width: 768px) {
  .pdx-tract-stats {
    font-size: 2em;
  }
}
@media screen and (min-height: 735px) {
  .pdx-tract__text--dataSource {
    display: block;
  }
}
</style>
