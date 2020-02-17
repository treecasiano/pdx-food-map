<template>
  <v-app id="app" style="overflow: hidden;">
    <v-toolbar dense flat color="primary darken-3" class="accent--text pdx-toolbar--main">
      <v-toolbar-title>
        <a
          alt="Link to Home"
          href="/"
          class="accent--text font-weight-bold"
          style="text-decoration: none;"
        >PDX Metro Food Map</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="nav">
        <router-link to="/">Map</router-link>
        <span class="mx-2 white--text">|</span>
        <router-link to="/about">About</router-link>
      </div>
    </v-toolbar>
    <router-view :loading="loading" />
    <v-footer color="primary darken-3" class="pa-3 accent--text pdx-footer">
      <v-layout column>
        <v-flex>
          View this project on
          <a href="https://github.com/treecasiano/pdx-food-map">GitHub</a>.
        </v-flex>
        <v-flex>
          &copy; {{ new Date().getFullYear() }}
          <a href="http://treecasiano.com">Tree Casiano</a>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  async created() {
    this.loading = true;
    try {
      Promise.all([
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

#app {
  font-family: "Muli", sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.mono-font {
  font-family: "Courier New", Courier, monospace !important;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

#nav a {
  color: var(--v-secondary-lighten2);
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: var(--v-accent);
}

#nav a:hover,
.pdx-footer a:hover {
  opacity: 0.8;
}

.pdx-toolbar--main {
  font-weight: bold;
}

.pdx-footer {
  padding: 10px;
  height: 60px !important;
}

.pdx-footer a {
  color: var(--v-secondary-lighten2) !important;
  text-decoration: none;
}
</style>
