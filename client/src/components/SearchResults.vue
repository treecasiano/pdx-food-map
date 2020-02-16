<template>
  <div class="text-left scrollBox">
    <v-layout column justify-start>
      <div class="font-weight-bold primary--text">
        <v-icon color="secondary">shopping_cart</v-icon>Grocery Stores:
        <span
          class="font-weight-bold primary--text"
        >{{ searchResultGroceryStore.length }} result(s)</span>
      </div>

      <div>
        <ul class="text-left" style="list-style-type: none; padding-left: 0;">
          <li
            v-for="item in searchResultGroceryStore"
            v-bind:item="item"
            v-bind:key="item.gid"
            style="display: block;"
          >
            <v-btn icon small class="text-left" color="primary" @click.stop="centerOnPoint(item)">
              <v-icon class="mr-1" small>near_me</v-icon>
            </v-btn>
            {{ item.name }} ({{ item.distance | metersToMiles }} mi)
          </li>
        </ul>
      </div>
    </v-layout>
    <v-layout column justify-start>
      <div class="font-weight-bold primary--text">
        <v-icon color="secondary">store</v-icon>Farmers Markets:
        <span
          class="font-weight-bold primary--text"
        >{{ searchResultFarmersMarket.length }} result(s)</span>
      </div>

      <div class="searchResults scrollBox">
        <ul class="text-left" style="list-style-type: none; padding-left: 0;">
          <li
            v-for="item in searchResultFarmersMarket"
            v-bind:item="item"
            v-bind:key="item.gid"
            style="display: block;"
          >
            <v-btn icon small class="text-left" color="primary" @click.stop="centerOnPoint(item)">
              <v-icon class="mr-1" small>near_me</v-icon>
            </v-btn>
            {{ item.location_name }} ({{ item.distance | metersToMiles }} mi)
          </li>
        </ul>
      </div>
    </v-layout>
    <v-layout column justify-start>
      <div class="font-weight-bold primary--text">
        <v-icon color="secondary">star</v-icon>Food Pantries:
        <span
          class="font-weight-bold primary--text"
        >{{ searchResultFoodPantry.length }} result(s)</span>
      </div>

      <div class="searchResults scrollBox">
        <ul class="text-left" style="list-style-type: none; padding-left: 0;">
          <li
            v-for="item in searchResultFoodPantry"
            v-bind:item="item"
            v-bind:key="item.gid"
            style="display: block;"
          >
            <v-btn icon small class="text-left" color="primary" @click.stop="centerOnPoint(item)">
              <v-icon class="mr-1" small>near_me</v-icon>
            </v-btn>
            {{ item.market }} ({{ item.distance | metersToMiles }} mi)
          </li>
        </ul>
      </div>
    </v-layout>
    <v-layout column justify-start>
      <div class="font-weight-bold primary--text">
        <v-icon color="secondary">star</v-icon>CSA Dropoff Sites:
        <span
          class="font-weight-bold primary--text"
        >{{ searchResultCsaDropoffSite.length }} result(s)</span>
      </div>

      <div class="searchResults scrollBox">
        <ul class="text-left" style="list-style-type: none; padding-left: 0;">
          <li
            v-for="item in searchResultCsaDropoffSite"
            v-bind:item="item"
            v-bind:key="item.gid"
            style="display: block;"
          >
            <v-btn icon small class="text-left" color="primary" @click.stop="centerOnPoint(item)">
              <v-icon class="mr-1" small>near_me</v-icon>
            </v-btn>
            {{ item.farm_name }} ({{ item.distance | metersToMiles }} mi)
          </li>
        </ul>
      </div>
    </v-layout>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "SearchResults",
  computed: {
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
      // TODO: return latitude and longitude and center on point
      this.setCenter([item.latitude, item.longitude]);
      this.setZoom(17);
    },
    ...mapMutations({
      setCenter: "map/setCenter",
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
