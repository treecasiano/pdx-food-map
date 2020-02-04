<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      width="320"
    >
      <template v-slot:prepend>
        <v-list-item v-if="mini" dense>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon color="primary">mdi-chevron-right</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item v-if="!mini" dense>
          <v-spacer></v-spacer>
          <v-btn small icon @click.stop="mini = !mini">
            <v-icon color="primary">mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <v-container v-if="!mini">
          <v-tabs
            v-model="tab"
            centered
            active-class="mapControls__tabs--active"
            height="30"
          >
            <v-tab href="#welcome" ripple>
              <v-icon>star</v-icon>
            </v-tab>
            <v-tab href="#search" ripple>
              <v-icon>search</v-icon>
            </v-tab>
            <v-tab-item key="1" value="welcome">
              <v-layout column>
                <h2 class="primary--text mb-2">
                  Welcome to the PDX Metro Food Environment Map!
                </h2>
                <p>
                  This application will.,,
                </p>
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
import SearchResults from "@/components/SearchResults.vue";
import MapControls from "@/components/MapControls.vue";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  components: { SearchResults },
  computed: {
    ...mapState({
      searchResultGroceryStore: state => state.groceryStore.searchResult,
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
    }),
  },
  created() {},
  data() {
    return {
      drawer: true,
      mini: false,
      showSearchResult: false,
      tab: null,
    };
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
</style>
