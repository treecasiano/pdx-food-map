<template>
  <v-app id="app">
    <v-app-bar
      app
      dense
      flat
      color="primary darken-3"
      class="accent--text pdx-toolbar--main"
    >
      <v-toolbar-title>PDX Metro Food Environment Map</v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="nav">
        <router-link to="/">Map</router-link>
        <span class="mx-2 white--text">|</span>
        <router-link to="/about">About</router-link>
        <span v-if="isAdmin">
          <span class="mx-2 white--text">|</span>
          <router-link :to="`/admin/${selectedAdminTab}`">Admin</router-link>
        </span>
      </div>
    </v-app-bar>
    <v-content>
      <router-view :loading="loading" />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      isAdmin: state => state.session.isAdmin,
      selectedAdminTab: state => state.admin.selectedTab,
    }),
  },
  async created() {
    this.loading = true;
    try {
      Promise.all([
        await this.fetchBikePathPortlandData(),
        await this.fetchCsaDropoffSiteData(),
        await this.fetchCtranRouteData(),
        await this.fetchCtranStopData(),
        await this.fetchFarmersMarketData(),
        await this.fetchFoodPantryData(),
        await this.fetchGroceryStoreData(),
        await this.fetchPdxTractData(),
        await this.fetchTrimetRouteData(),
        await this.fetchTrimetStopData(),
        await this.fetchTrailClarkCountyData(),
      ]);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
    this.loading = false;
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      fetchBikePathPortlandData: "bikePathPortland/geoJSON",
      fetchCsaDropoffSiteData: "csaDropoffSite/geoJSON",
      fetchCtranRouteData: "ctranRoute/geoJSON",
      fetchCtranStopData: "ctranStop/geoJSON",
      fetchFarmersMarketData: "farmersMarket/geoJSON",
      fetchFoodPantryData: "foodPantry/geoJSON",
      fetchGroceryStoreData: "groceryStore/geoJSON",
      fetchPdxTractData: "pdxTract/geoJSON",
      fetchTrailClarkCountyData: "trailClarkCounty/geoJSON",
      fetchTrimetRouteData: "trimetRoute/geoJSON",
      fetchTrimetStopData: "trimetStop/geoJSON",
    }),
  },
};
</script>

<style>
/* GLOBAL STYLES  */
@import url("https://fonts.googleapis.com/css?family=Muli");

html {
  overflow-y: auto !important;
}

#app {
  font-family: "Muli", sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.mono-font {
  font-family: "Courier New", Courier, monospace !important;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

#nav li {
  display: inline-block;
}

#nav a {
  color: var(--v-tertiary-lighten2);
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: var(--v-accent);
}

#nav a:hover,
.pdx-footer a:hover {
  opacity: 0.8;
}

.leaflet-container {
  font-size: 0.9rem !important;
}

.pdx-toolbar--main {
  font-weight: bold;
}

.pdx-footer {
  padding: 10px;
  height: 60px !important;
}

.pdx-footer a {
  color: white !important;
  text-decoration: none;
  font-weight: bold;
}
</style>
