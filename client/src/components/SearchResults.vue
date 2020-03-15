<template>
  <div class="searchResultsContainer">
    <div v-if="geosearchResult">
      <div class="d-flex align-center">
        <v-slider
          :max="10"
          :min=".25"
          @change="searchForPoints"
          class="mt-10"
          color="secondary"
          label="Search Radius (miles)"
          step=".25"
          thumb-color="secondary"
          thumb-size="34"
          thumb-label="always"
          tick-size=".25"
          ticks="always"
          v-model="searchRadius"
        ></v-slider>
      </div>
      <div v-if="!searchResultsLoading">
        <div class="font-weight-bold primary--text overline">Sources of Fresh Produce</div>
        <v-expansion-panels hover popout class="mt-1">
          <v-expansion-panel>
            <v-expansion-panel-header
              class="font-weight-bold"
              :class="searchResultGroceryStore.length ? 'secondary--text' : 'primary--text'"
            >
              <div>Grocery Stores ({{ searchResultGroceryStore.length }})</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="scrollBox--searchResult">
              <v-layout column justify-start>
                <div v-if="searchResultGroceryStore.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultGroceryStore"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <div class="d-flex align-center">
                        <v-btn
                          icon
                          small
                          color="tertiary"
                          @click.stop="flyToPoint(item, 'groceryStore')"
                        >
                          <v-icon small>near_me</v-icon>
                        </v-btn>
                        <div>{{ item.name }} ({{ item.distance | metersToMiles }} mi)</div>
                      </div>
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
            <v-expansion-panel-content class="scrollBox--searchResult">
              <v-layout column justify-start>
                <div v-if="searchResultFarmersMarket.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultFarmersMarket"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <div class="d-flex align-center">
                        <v-btn
                          icon
                          small
                          color="tertiary"
                          @click.stop="flyToPoint(item, 'farmersMarket')"
                        >
                          <v-icon small>near_me</v-icon>
                        </v-btn>
                        <div>{{ item.market }} ({{ item.distance | metersToMiles }} mi)</div>
                      </div>
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
            <v-expansion-panel-content class="scrollBox--searchResult">
              <v-layout column justify-start>
                <div v-if="searchResultFoodPantry.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultFoodPantry"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <div class="d-flex align-center">
                        <v-btn
                          icon
                          small
                          color="tertiary"
                          @click.stop="flyToPoint(item, 'foodPantry')"
                        >
                          <v-icon small>near_me</v-icon>
                        </v-btn>
                        <div>{{ item.location_name }} ({{ item.distance | metersToMiles }} mi)</div>
                      </div>
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
            <v-expansion-panel-content class="scrollBox--searchResult">
              <v-layout column justify-start>
                <div v-if="searchResultCsaDropoffSite.length > 0">
                  <ul class="searchResultUnorderedList">
                    <li
                      class="searchResultListItem"
                      v-for="item in searchResultCsaDropoffSite"
                      v-bind:item="item"
                      v-bind:key="item.gid"
                    >
                      <div class="d-flex align-center">
                        <v-btn
                          icon
                          small
                          color="tertiary"
                          @click.stop="flyToPoint(item, 'csaDropoffSite')"
                        >
                          <v-icon small>near_me</v-icon>
                        </v-btn>
                        <div>{{ item.farm_name }} ({{ item.distance | metersToMiles }} mi)</div>
                      </div>
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
      <div class="d-flex justify-end">
        <v-btn
          @click="clearSearchResults"
          :disabled="!geosearchResult"
          class="mt-3 font-weight-bold"
          small
          color="secondary"
          text
        >
          <v-icon class="mr-1">close</v-icon>Clear Search
        </v-btn>
      </div>
      <div class="searchLocation">
        <div class="font-weight-bold primary--text mt-2 overline">Search Location</div>
        <div>{{geosearchResult.locationLabel}}</div>
      </div>
    </div>
    <div v-else class="primary--text">
      <h1 class="secondary--text my-3">Show Me the Vegetables!</h1>
      <div
        class="body-2"
      >Enter a Portland Metro area address in the search bar at the top of the map and discover nearby sources of fresh produce.</div>
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
.searchLocation {
  display: none;
}

@media screen and (min-width: 768px) {
  .searchLocation {
    display: inline-block;
  }
}

.searchResultsContainer .v-expansion-panel-header,
.search ResultsContainer .v-expansion-panel-header--active {
  padding: 5px 10px !important;
  min-height: 10px;
}

.search ResultsContainer .v-expansion-panel-header--active {
  margin-bottom: 5px;
  height: 10px !important;
}
.searchResultUnorderedList {
  list-style-type: none !important;
  padding-left: 0 !important;
}
.searchResultListItem {
  display: block;
  margin-left: -0.6rem;
}
.scrollBox--searchResult {
  max-height: 100px;
  overflow-y: scroll;
}
</style>
