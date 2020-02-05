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
      <v-divider class="my-3"></v-divider>
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
            {{ item.market }} ({{ item.distance | metersToMiles }} mi)
          </li>
        </ul>
      </div>
    </v-layout>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
// TODO: return lat and long with search results
export default {
  name: "SearchResults",
  computed: {
    ...mapState({
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
    }),
  },
  data() {
    return {};
  },
  methods: {
    centerOnPoint(item) {
      // TODO: return latitude and longitude and center on point
      // this.setCenter([item.latitude, item.longitude]);
      // this.setZoom(17);
    },
    ...mapMutations({
      setDisplayStatusFarmersMarket: "farmersMarket/setDisplayStatus",
      setDisplayStatusGroceryStore: "groceryStore/setDisplayStatus",
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
