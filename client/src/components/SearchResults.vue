<template>
  <div class="text-left">
    <v-text-field
      v-model="searchRadius"
      color="primary"
      type="number"
      step="0.25"
      max="10"
      min="0.25"
      label="Set a search radius (0.25 - 10 mi)"
    ></v-text-field>
    <v-btn>Search</v-btn>
    <div class="font-weight-bold primary--text">SEARCH RESULTS</div>
    <v-expansion-panels accordion hover flat>
      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-bold primary--text">
          <div>Grocery Stores ({{ searchResultGroceryStore.length }})</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-layout column justify-start>
            <div v-if="searchResultGroceryStore.length > 0">
              <ul class="text-left" style="list-style-type: none; padding-left: 0;">
                <li
                  v-for="item in searchResultGroceryStore"
                  v-bind:item="item"
                  v-bind:key="item.gid"
                  style="display: block;"
                >
                  <v-btn
                    icon
                    small
                    class="text-left"
                    color="primary"
                    @click.stop="centerOnPoint(item)"
                  >
                    <v-icon small>near_me</v-icon>
                  </v-btn>
                  {{ item.name }} ({{ item.distance | metersToMiles }} mi)
                </li>
              </ul>
            </div>
            <div v-else>No results.</div>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-bold primary--text">
          <div>Farmers Markets ({{ searchResultFarmersMarket.length }})</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-layout column justify-start>
            <div v-if="searchResultFarmersMarket.length > 0">
              <ul class="text-left" style="list-style-type: none; padding-left: 0;">
                <li
                  v-for="item in searchResultFarmersMarket"
                  v-bind:item="item"
                  v-bind:key="item.gid"
                  style="display: block;"
                >
                  <v-btn
                    text
                    small
                    class="text-left"
                    color="primary"
                    @click.stop="centerOnPoint(item)"
                  >
                    <v-icon class="mr-1" small>near_me</v-icon>
                  </v-btn>
                  {{ item.market }} ({{ item.distance | metersToMiles }} mi)
                </li>
              </ul>
            </div>
            <div v-else>No results.</div>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-bold primary--text">
          <div>Food Pantries ({{ searchResultFoodPantry.length }})</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-layout column justify-start>
            <div v-if="searchResultFoodPantry.length > 0">
              <ul class="text-left" style="list-style-type: none; padding-left: 0;">
                <li
                  v-for="item in searchResultFoodPantry"
                  v-bind:item="item"
                  v-bind:key="item.gid"
                  style="display: block;"
                >
                  <v-btn
                    icon
                    small
                    class="text-left"
                    color="primary"
                    @click.stop="centerOnPoint(item)"
                  >
                    <v-icon small>near_me</v-icon>
                  </v-btn>
                  {{ item.location_name }} ({{ item.distance | metersToMiles }} mi)
                </li>
              </ul>
            </div>
            <div v-else>No results.</div>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-bold primary--text">
          <div>CSA Dropoff Sites ({{ searchResultCsaDropoffSite.length }})</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-layout column justify-start>
            <div v-if="searchResultCsaDropoffSite.length > 0">
              <ul class="text-left" style="list-style-type: none; padding-left: 0">
                <li
                  v-for="item in searchResultCsaDropoffSite"
                  v-bind:item="item"
                  v-bind:key="item.gid"
                  style="display: block;"
                >
                  <v-btn
                    icon
                    small
                    class="text-left"
                    color="primary"
                    @click.stop="centerOnPoint(item)"
                  >
                    <v-icon small>near_me</v-icon>
                  </v-btn>
                  {{ item.farm_name }} ({{ item.distance | metersToMiles }} mi)
                </li>
              </ul>
            </div>
            <div v-else>No results.</div>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "SearchResults",
  computed: {
    searchRadius: {
      get() {
        return this.$store.state.map.searchRadius;
      },
      set(value) {
        this.setSearchRadius(value);
      },
    },
    ...mapState({
      searchResultCsaDropoffSite: state => state.csaDropoffSite.searchResult,
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
      searchResultFoodPantry: state => state.foodPantry.searchResult,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
    }),
  },
  data() {
    return {};
  },
  methods: {
    centerOnPoint(item) {
      this.setCenter([item.latitude, item.longitude]);
      this.setZoom(18);
    },
    ...mapMutations({
      setCenter: "map/setCenter",
      setSearchRadius: "map/setSearchRadius",
      setZoom: "map/setZoom",
    }),
  },
};
</script>
<style>
.scrollBox {
  overflow: auto;
}
</style>
