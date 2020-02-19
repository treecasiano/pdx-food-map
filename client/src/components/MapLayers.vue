<template>
  <v-card>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent width="340px">
      <template v-slot:prepend>
        <div v-if="mini" class="text-center">
          <v-btn small icon @click.stop="mini = !mini">
            <v-icon color="primary">mdi-layers</v-icon>
          </v-btn>
        </div>
        <v-list-item v-if="!mini" dense>
          <div class="primary--text font-weight-black mt-2">MAP LAYERS</div>
          <v-spacer></v-spacer>
          <v-btn small icon @click.stop="mini = !mini">
            <v-icon color="primary">mdi-close</v-icon>
          </v-btn>
        </v-list-item>
        <v-container v-if="!mini" class="mapLayers">
          <v-expansion-panels
            accordion
            hover
            flat
            active-class="pdx-mapLayerExpansionPanels--active"
          >
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold primary--text">Census Tracts</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox
                  v-model="displayStatusPdxTract"
                  :label="`Census Tracts`"
                  data-cy="checkbox--censusTracts"
                ></v-checkbox>
                <v-checkbox
                  color="accent"
                  v-if="displayStatusPdxTract"
                  v-model="displayStatusTooltip"
                  :label="`Census Tract Tooltips`"
                  data-cy="checkbox--tooltips"
                ></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header
                class="font-weight-bold primary--text"
              >Sources of Healthy Food</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox
                  v-if="groceryStoreData.features"
                  v-model="displayStatusGroceryStore"
                  data-cy="checkbox--groceryStores"
                  label="Grocery Stores"
                ></v-checkbox>
                <v-select
                  dense
                  v-if="displayStatusGroceryStore"
                  v-model="groceryStoreType"
                  @change="filterStores"
                  :items="items"
                  class="primary--text"
                  label="Filter by Store Type"
                  style="z-index: 10000"
                ></v-select>

                <v-checkbox
                  v-if="farmersMarketData.features"
                  v-model="displayStatusFarmersMarket"
                  color="primary"
                  data-cy="checkbox--farmersMarket"
                  label="Farmers Markets"
                ></v-checkbox>
                <v-checkbox
                  v-if="foodPantryData.features"
                  v-model="displayStatusFoodPantry"
                  color="primary"
                  data-cy="checkbox--foodPantry"
                  label="Food Pantries"
                ></v-checkbox>
                <v-checkbox
                  v-if="csaDropoffSiteData.features"
                  v-model="displayStatusCsaDropoffSite"
                  color="primary"
                  data-cy="checkbox--csaDropoffSite"
                  label="Community Supported Agriculture Dropoff Sites"
                ></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold primary--text">Public Transportation</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox
                  v-if="trimetRouteData.features"
                  v-model="displayStatusTrimetRoute"
                  color="primary"
                  data-cy="checkbox--trimetRoute"
                  label="TriMet Routes"
                ></v-checkbox>
                <v-checkbox
                  v-if="trimetStopData.features"
                  v-model="displayStatusTrimetStop"
                  color="primary"
                  data-cy="checkbox--trimetStop"
                  label="TriMet Stops"
                ></v-checkbox>
                <v-checkbox
                  v-if="ctranRouteData.features"
                  v-model="displayStatusCtranRoute"
                  color="primary"
                  data-cy="checkbox--ctranRoute"
                  label="C-TRAN Routes"
                ></v-checkbox>
                <v-checkbox
                  v-if="ctranStopData.features"
                  v-model="displayStatusCtranStop"
                  color="primary"
                  data-cy="checkbox--ctranStop"
                  label="C-TRAN Stops"
                ></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold primary--text">Paths & Trails</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox
                  v-if="bikePathPortlandData.features"
                  v-model="displayStatusBikePathPortland"
                  color="primary"
                  data-cy="checkbox--bikePathPortland"
                  label="Bike Paths (Portland, OR)"
                ></v-checkbox>
                <v-checkbox
                  v-if="trailClarkCountyData.features"
                  v-model="displayStatusTrailClarkCounty"
                  color="primary"
                  data-cy="checkbox--trailClarkCounty"
                  label="Bike & Pedestrian Trails (Clark County, WA)"
                ></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "MapLayers",
  computed: {
    displayStatusBikePathPortland: {
      get() {
        return this.$store.state.bikePathPortland.displayStatus;
      },
      set(value) {
        this.setDisplayStatusBikePathPortland(value);
      },
    },
    displayStatusCsaDropoffSite: {
      get() {
        return this.$store.state.csaDropoffSite.displayStatus;
      },
      set(value) {
        this.setDisplayStatusCsaDropoffSite(value);
      },
    },
    displayStatusCtranRoute: {
      get() {
        return this.$store.state.ctranRoute.displayStatus;
      },
      set(value) {
        this.setDisplayStatusCtranRoute(value);
      },
    },
    displayStatusCtranStop: {
      get() {
        return this.$store.state.ctranStop.displayStatus;
      },
      set(value) {
        this.setDisplayStatusCtranStop(value);
      },
    },
    displayStatusFarmersMarket: {
      get() {
        return this.$store.state.farmersMarket.displayStatus;
      },
      set(value) {
        this.setDisplayStatusFarmersMarket(value);
      },
    },
    displayStatusFoodPantry: {
      get() {
        return this.$store.state.foodPantry.displayStatus;
      },
      set(value) {
        this.setDisplayStatusFoodPantry(value);
      },
    },
    displayStatusGroceryStore: {
      get() {
        return this.$store.state.groceryStore.displayStatus;
      },
      set(value) {
        this.setDisplayStatusGroceryStore(value);
      },
    },
    displayStatusPdxTract: {
      get() {
        return this.$store.state.pdxTract.displayStatus;
      },
      set(value) {
        this.setDisplayStatusPdxTract(value);
      },
    },
    displayStatusTooltip: {
      get() {
        return this.$store.state.map.displayStatusTooltip;
      },
      set(value) {
        this.setDisplayStatusTooltip(value);
      },
    },
    displayStatusTrailClarkCounty: {
      get() {
        return this.$store.state.trailClarkCounty.displayStatus;
      },
      set(value) {
        this.setDisplayStatusTrailClarkCounty(value);
      },
    },
    displayStatusTrimetRoute: {
      get() {
        return this.$store.state.trimetRoute.displayStatus;
      },
      set(value) {
        this.setDisplayStatusTrimetRoute(value);
      },
    },
    displayStatusTrimetStop: {
      get() {
        return this.$store.state.trimetStop.displayStatus;
      },
      set(value) {
        this.setDisplayStatusTrimetStop(value);
      },
    },
    ...mapState({
      bikePathPortlandData: state => state.bikePathPortland.geoJSON,
      csaDropoffSiteData: state => state.csaDropoffSite.geoJSON,
      ctranRouteData: state => state.ctranRoute.geoJSON,
      ctranStopData: state => state.ctranStop.geoJSON,
      farmersMarketData: state => state.farmersMarket.geoJSON,
      foodPantryData: state => state.foodPantry.geoJSON,
      groceryStoreData: state => state.groceryStore.geoJSON,
      pdxTractData: state => state.pdxTract.geoJSON,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
      trailClarkCountyData: state => state.trailClarkCounty.geoJSON,
      trimetRouteData: state => state.trimetRoute.geoJSON,
      trimetStopData: state => state.trimetStop.geoJSON,
    }),
  },
  data() {
    return {
      drawer: true,
      mini: true,
      items: [
        "All Stores",
        "Large Chain Grocery",
        "Independent or Ethnic Grocery",
      ],
      groceryStoreType: "All Stores",
    };
  },
  methods: {
    async filterStores(value) {
      const params = { type: value };
      if (value == "All Stores") {
        await this.fetchGroceryStoreData();
      } else {
        await this.fetchGroceryStoreData(params);
      }
    },
    ...mapActions({
      fetchGroceryStoreData: "groceryStore/geoJSON",
    }),
    ...mapMutations({
      setDisplayStatusBikePathPortland: "bikePathPortland/setDisplayStatus",
      setDisplayStatusCsaDropoffSite: "csaDropoffSite/setDisplayStatus",
      setDisplayStatusCtranRoute: "ctranRoute/setDisplayStatus",
      setDisplayStatusCtranStop: "ctranStop/setDisplayStatus",
      setDisplayStatusFarmersMarket: "farmersMarket/setDisplayStatus",
      setDisplayStatusFoodPantry: "foodPantry/setDisplayStatus",
      setDisplayStatusGroceryStore: "groceryStore/setDisplayStatus",
      setDisplayStatusPdxTract: "pdxTract/setDisplayStatus",
      setDisplayStatusTooltip: "map/setDisplayStatusTooltip",
      setDisplayStatusTrailClarkCounty: "trailClarkCounty/setDisplayStatus",
      setDisplayStatusTrimetRoute: "trimetRoute/setDisplayStatus",
      setDisplayStatusTrimetStop: "trimetStop/setDisplayStatus",
    }),
  },
  watch: {
    searchResultGroceryStore: function() {
      if (this.searchResultGroceryStore.length) {
        this.fetchGroceryStoreData();
        this.groceryStoreType = "All Stores";
      }
    },
  },
};
</script>

<style>
/* Vuetify override */

.v-navigation-drawer--mini-variant {
  width: 50px !important;
}

.v-input--checkbox {
  margin: 0.25rem !important;
  padding: 0.25rem !important;
}

.mapLayers
  .v-input--selection-controls:not(.v-input--hide-details)
  .v-input__slot {
  margin: 0.25rem !important;
}

.pdx-mapLayerExpansionPanels--active {
  background: var(--v-accent-lighten5) !important;
}
</style>
