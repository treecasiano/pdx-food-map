<template>
  <v-card>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent width="320px">
      <template v-slot:prepend>
        <div v-if="mini">
          <v-btn small icon @click.stop="mini = !mini">
            <v-icon color="primary">mdi-layers</v-icon>
          </v-btn>
        </div>
        <v-list-item v-if="!mini" dense>
          <v-spacer></v-spacer>
          <v-btn small icon @click.stop="mini = !mini">
            <v-icon color="primary">mdi-close</v-icon>
          </v-btn>
        </v-list-item>
        <v-container v-if="!mini" class="mapLayers">
          <v-layout>
            <v-flex class="mb-4">
              <div class="mapLayers__heading">
                <v-divider></v-divider>
                <div>Map Layers</div>
                <v-divider class="mb-4"></v-divider>
              </div>
              <v-checkbox
                v-model="displayStatusPdxTract"
                :label="`Census Tracts`"
                data-cy="checkbox--censusTracts"
              ></v-checkbox>
              <v-checkbox
                v-if="displayStatusPdxTract"
                v-model="displayStatusTooltip"
                :label="`Enable Tract Tooltips`"
                data-cy="checkbox--tooltips"
              ></v-checkbox>
              <div class="mapLayers__heading">
                <v-divider></v-divider>
                <div>Sources of Healthy Food</div>
                <v-divider class="mb-4"></v-divider>
              </div>
              <v-checkbox
                v-if="groceryStoreData.features"
                v-model="displayStatusGroceryStore"
                data-cy="checkbox--groceryStores"
                label="Grocery Stores"
              ></v-checkbox>
              <v-select
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
              <div class="mapLayers__heading my-2">
                <v-divider></v-divider>
                <div>Public Transportation</div>
                <v-divider></v-divider>
              </div>
              <v-checkbox
                v-if="trimetStopData.features"
                v-model="displayStatusTrimetStop"
                color="primary"
                data-cy="checkbox--trimetStop"
                label="TriMet Stops"
              ></v-checkbox>
              <v-checkbox
                v-if="ctranStopData.features"
                v-model="displayStatusCtranStop"
                color="primary"
                data-cy="checkbox--ctranStop"
                label="C-TRAN Stops"
              ></v-checkbox>
            </v-flex>
          </v-layout>
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
    displayStatusCsaDropoffSite: {
      get() {
        return this.$store.state.csaDropoffSite.displayStatus;
      },
      set(value) {
        this.setDisplayStatusCsaDropoffSiteData(value);
      },
    },
    displayStatusCtranStop: {
      get() {
        return this.$store.state.ctranStop.displayStatus;
      },
      set(value) {
        this.setDisplayStatusCtranStopData(value);
      },
    },
    displayStatusFarmersMarket: {
      get() {
        return this.$store.state.farmersMarket.displayStatus;
      },
      set(value) {
        this.setDisplayStatusFarmersMarketData(value);
      },
    },
    displayStatusFoodPantry: {
      get() {
        return this.$store.state.foodPantry.displayStatus;
      },
      set(value) {
        this.setDisplayStatusFoodPantryData(value);
      },
    },
    displayStatusGroceryStore: {
      get() {
        return this.$store.state.groceryStore.displayStatus;
      },
      set(value) {
        this.setDisplayStatusGroceryStoreData(value);
      },
    },
    displayStatusPdxTract: {
      get() {
        return this.$store.state.pdxTract.displayStatus;
      },
      set(value) {
        this.setDisplayStatusPdxTractData(value);
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
    displayStatusTrimetStop: {
      get() {
        return this.$store.state.trimetStop.displayStatus;
      },
      set(value) {
        this.setDisplayStatusTrimetStopData(value);
      },
    },
    ...mapState({
      csaDropoffSiteData: state => state.csaDropoffSite.geoJSON,
      ctranStopData: state => state.ctranStop.geoJSON,
      farmersMarketData: state => state.farmersMarket.geoJSON,
      foodPantryData: state => state.foodPantry.geoJSON,
      groceryStoreData: state => state.groceryStore.geoJSON,
      pdxTractData: state => state.pdxTract.geoJSON,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
      trimetStopData: state => state.trimetStop.geoJSON,
    }),
  },
  data() {
    return {
      drawer: true,
      mini: false,
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
      // TODO: Add try/catch
      if (value == "All Stores") {
        await this.fetchGroceryStoreData();
      } else {
        console.log("value", value);
        const params = { type: value };
        await this.fetchGroceryStoreData(params);
      }
    },
    ...mapActions({
      fetchCsaDropoffSiteData: "csaDropoffSide/geoJSON",
      fetchCtranStopData: "ctranStop/geoJSON",
      fetchFarmersMarketData: "farmersMarket/geoJSON",
      fetchFoodPantryData: "foodPantry/geoJSON",
      fetchGroceryStoreData: "groceryStore/geoJSON",
      fetchPdxTractData: "pdxTract/geoJSON",
      fetchTrimetStopData: "trimetStop/geoJSON",
    }),
    ...mapMutations({
      setDisplayStatusCsaDropoffSiteData: "csaDropoffSite/setDisplayStatus",
      setDisplayStatusCtranStopData: "ctranStop/setDisplayStatus",
      setDisplayStatusFarmersMarketData: "farmersMarket/setDisplayStatus",
      setDisplayStatusFoodPantryData: "foodPantry/setDisplayStatus",
      setDisplayStatusGroceryStoreData: "groceryStore/setDisplayStatus",
      setDisplayStatusPdxTractData: "pdxTract/setDisplayStatus",
      setDisplayStatusTooltip: "map/setDisplayStatusTooltip",
      setDisplayStatusTrimetStopData: "trimetStop/setDisplayStatus",
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
  margin: 0 !important;
  padding: 0 !important;
}

.mapLayers
  .v-input--selection-controls:not(.v-input--hide-details)
  .v-input__slot {
  margin: 0 !important;
}

.mapLayers__heading {
  /* hiding headings on small screens by default */
  font-size: 16px;
  font-weight: bold;
  display: none;
  color: var(--v-primary-darken1);
  background: var(--v-accent-lighten4);
}

/* when screen height is taller than 700px */
@media only screen and (min-height: 700px) {
  .mapLayers__heading {
    display: block;
  }
}
</style>
