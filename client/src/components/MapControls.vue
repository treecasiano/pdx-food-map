<template>
  <v-card class="mt-10">
    <v-navigation-drawer
      class="mapControls__navDrawer"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
    >
      <template v-slot:prepend>
        <v-list-item v-if="mini" dense>
          <v-btn small icon @click.stop="mini = false">
            <v-icon color="primary">mdi-chevron-right</v-icon>
          </v-btn>
        </v-list-item>
        <v-container v-if="!mini" class="text-left">
          <v-btn small icon @click.stop="mini = true">
            <v-icon color="primary">mdi-chevron-left</v-icon>
          </v-btn>
          <v-tabs
            v-model="selectedTab"
            centered
            active-class="mapControls__tabs--active"
            height="30"
          >
            <v-tab href="#map" ripple>
              <v-icon>map</v-icon>
            </v-tab>
            <v-tab href="#search" ripple>
              <v-icon>search</v-icon>
            </v-tab>
            <v-tab-item key="1" value="map">
              <v-layout column mt-2>
                <CensusTractProfile />
              </v-layout>
            </v-tab-item>
            <v-tab-item key="2" value="search">
              <v-layout column mt-2>
                <SearchResults />
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
import CensusTractProfile from "@/components/CensusTractProfile.vue";
import SearchResults from "@/components/SearchResults.vue";
import { mapMutations, mapState } from "vuex";

export default {
  components: { CensusTractProfile, SearchResults },
  computed: {
    selectedTab: {
      get() {
        return this.$store.state.map.selectedTab;
      },
      set(value) {
        this.setSelectedTab(value);
      },
    },
    mini: {
      get() {
        return this.$store.state.map.mapControlMini;
      },
      set(value) {
        this.setMapControlMini(value);
      },
    },
    ...mapState({
      searchResultGroceryStore: state => state.groceryStore.searchResult,
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
    }),
  },
  created() {},
  data() {
    return {
      drawer: true,
      showSearchResult: false,
    };
  },
  methods: {
    ...mapMutations({
      setMapControlMini: "map/setMapControlMini",
      setSelectedTab: "map/setSelectedTab",
    }),
  },
};
</script>

<style>
.mapControls__heading {
  font-weight: bold;
}
.mapControls__tabs--active {
  background-color: var(--v-accent-lighten4);
}

.mapControls__navDrawer {
  width: 300px !important;
}

@media screen and (min-width: 768px) {
  .mapControls__navDrawer {
    width: 400px !important;
  }
}
</style>
