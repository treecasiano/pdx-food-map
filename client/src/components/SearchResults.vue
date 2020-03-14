<template>
  <div>
    <div v-if="geosearchResult">
      <div class="font-weight-bold primary--text overline">Search Location</div>
      <div>{{geosearchResult.locationLabel}}</div>
      <div class="d-flex align-center">
        <v-text-field
          v-model="searchRadius"
          class="ma-2"
          color="primary"
          type="number"
          step="0.25"
          max="10"
          min="0.25"
          label="Search radius (0.25 - 10 mi)"
        ></v-text-field>
        <v-btn
          @click="searchForPoints"
          :disabled="!geosearchResult"
          class="mx-5 font-weight-bold"
          color="secondary"
          rounded
        >Search</v-btn>
      </div>
      <div class="d-flex justify-center">
        <v-btn
          @click="clearSearchResults"
          :disabled="!geosearchResult"
          class="mb-3 font-weight-bold"
          small
          color="secondary"
          rounded
          outlined
        >Clear Search Results</v-btn>
      </div>
      <div v-if="!searchResultsLoading">
        <div class="font-weight-bold primary--text overline mt-2">Search Results</div>
        <v-expansion-panels accordion hover flat>
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold"
              :class="searchResultGroceryStore.length ? 'secondary--text' : 'primary--text'"
            >
              <div>Grocery Stores ({{ searchResultGroceryStore.length }})</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout column justify-start>
                <div v-if="searchResultGroceryStore.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultGroceryStore"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <v-btn
                        icon
                        small
                        color="primary"
                        @click.stop="flyToPoint(item, 'groceryStore')"
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
            <v-expansion-panel-header
              class="font-weight-bold"
              :class="searchResultFarmersMarket.length ? 'secondary--text' : 'primary--text'"
            >
              <div>Farmers Markets ({{ searchResultFarmersMarket.length }})</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout column justify-start>
                <div v-if="searchResultFarmersMarket.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultFarmersMarket"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <v-btn
                        text
                        small
                        color="primary"
                        @click.stop="flyToPoint(item, 'farmersMarket')"
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
            <v-expansion-panel-header
              class="font-weight-bold"
              :class="searchResultFoodPantry.length ? 'secondary--text' : 'primary--text'"
            >
              <div>Food Pantries ({{ searchResultFoodPantry.length }})</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout column justify-start>
                <div v-if="searchResultFoodPantry.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultFoodPantry"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <v-btn
                        icon
                        small
                        color="primary"
                        @click.stop="flyToPoint(item, 'foodPantry')"
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
            <v-expansion-panel-header
              class="font-weight-bold"
              :class="searchResultCsaDropoffSite.length ? 'secondary--text' : 'primary--text'"
            >
              <div>CSA Dropoff Sites ({{ searchResultCsaDropoffSite.length }})</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout column justify-start>
                <div v-if="searchResultCsaDropoffSite.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultCsaDropoffSite"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <v-btn
                        icon
                        small
                        color="primary"
                        @click.stop="flyToPoint(item, 'csaDropoffSite')"
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
      <div v-else>
        <v-progress-circular indeterminate rotate class="ma-2" color="secondary darken-1"></v-progress-circular>Loading Search Results..
      </div>
    </div>
    <div v-else class="primary--text">
      <h1 class="secondary--text my-3">Show Me the Vegetables!</h1>
      <div>Enter a Portland Metro area address in the search bar at the top of the map and discover nearby sources of fresh produce.</div>
    </div>
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
      geosearchResult: state => state.map.geosearchResult,
      searchResultCsaDropoffSite: state => state.csaDropoffSite.searchResult,
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
      searchResultFoodPantry: state => state.foodPantry.searchResult,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
      zoom: state => state.map.zoom,
    }),
  },
  data() {
    return {
      searchResultsLoading: false,
    };
  },
  methods: {
    flyToPoint(item, itemType) {
      this.setSelectedSearchResult(
        Object.assign(item, { markerRef: `${itemType}Marker${item.gid}` })
      );
      const latLong = [item.latitude, item.longitude];
      const zoom = this.zoom < 13 ? 13 : this.zoom;
      this.setFlyToOptions({ latLong, zoom });
    },
    clearSearchResults(e) {
      // Programmatically click on the reset button
      // to clear the third-party geosearch plugin.
      const geosearchResetButton = document.querySelector(".reset");
      geosearchResetButton.click();
      // Clear the results in the Vuex state.
      this.setGeosearchResult(null);
    },
    async searchForPoints() {
      this.searchResultsLoading = true;
      const { geom } = this.geosearchResult;
      // 1 mile = 1609.34 meters
      const distance = this.searchRadius * 1609.34;
      const params = { geom, distance };
      const latLong = geom.split(",").reverse();
      const zoom = this.zoom < 13 ? 13 : this.zoom;
      this.setFlyToOptions({ latLong, zoom });
      try {
        Promise.all([
          await this.$store.dispatch("groceryStore/search", params),
          await this.$store.dispatch("farmersMarket/search", params),
          await this.$store.dispatch("foodPantry/search", params),
          await this.$store.dispatch("csaDropoffSite/search", params),
        ]);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
      this.searchResultsLoading = false;
    },
    ...mapMutations({
      setCenter: "map/setCenter",
      setFlyToOptions: "map/setFlyToOptions",
      setGeosearchResult: "map/setGeosearchResult",
      setSearchRadius: "map/setSearchRadius",
      setSelectedSearchResult: "map/setSelectedSearchResult",
      setZoom: "map/setZoom",
    }),
  },
};
</script>
<style>
.searchResultUnorderedList {
  list-style-type: none !important;
  padding-left: 0 !important;
}
.searchResultListItem {
  display: block;
  margin-left: -0.6rem;
}
.scrollBox {
  overflow: auto;
}
</style>
