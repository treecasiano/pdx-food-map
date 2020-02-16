<template>
  <v-card>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
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
                v-if="groceryStoreData.features"
                v-model="displayStatusGroceryStore"
                data-cy="checkbox--groceryStores"
                label="Grocery Stores"
              ></v-checkbox>

              <v-radio-group
                v-if="displayStatusGroceryStore"
                v-model="radiosStoreType"
                style="margin: 0 0 -15px 32px;"
                @change="filterStores"
                label="Filter by Store Type"
              >
                <v-radio color="accent" value="all" data-cy="radioButton--allStores" label="All"></v-radio>
                <v-radio
                  color="accent"
                  value="Large Chain Grocery"
                  data-cy="radioButton--largeChain"
                  label="Large Chain"
                ></v-radio>
                <v-radio
                  color="accent"
                  value="Independent or Ethnic Grocery"
                  data-cy="radioButton--independent"
                  label="Independent or Ethnic"
                ></v-radio>
              </v-radio-group>
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
    ...mapState({
      farmersMarketData: state => state.farmersMarket.geoJSON,
      foodPantryData: state => state.foodPantry.geoJSON,
      groceryStoreData: state => state.groceryStore.geoJSON,
      pdxTractData: state => state.pdxTract.geoJSON,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
    }),
  },
  data() {
    return {
      drawer: true,
      mini: false,
      radiosGroceryStore: "all",
      radiosStoreType: "all",
    };
  },
  methods: {
    async filterStores(value) {
      if (value == "all") {
        await this.fetchGroceryStoreData();
      } else {
        const params = { type: value };
        await this.fetchGroceryStoreData(params);
      }
    },
    ...mapActions({
      fetchFarmersMarketData: "farmersMarket/geoJSON",
      fetchFoodPantryData: "foodPantry/geoJSON",
      fetchGroceryStoreData: "groceryStore/geoJSON",
      fetchPdxTractData: "pdxTract/geoJSON",
    }),
    ...mapMutations({
      setDisplayStatusPdxTractData: "pdxTract/setDisplayStatus",
      setDisplayStatusTooltip: "map/setDisplayStatusTooltip",
      setDisplayStatusFarmersMarketData: "farmersMarket/setDisplayStatus",
      setDisplayStatusFoodPantryData: "foodPantry/setDisplayStatus",
      setDisplayStatusGroceryStoreData: "groceryStore/setDisplayStatus",
    }),
  },
  watch: {
    searchResultGroceryStore: function() {
      if (this.searchResultGroceryStore.length) {
        this.fetchGroceryStoreData();
        this.radiosGroceryStore = "all";
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

.layerControls--radioButtons {
  height: 22px !important;
  padding: 0;
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
