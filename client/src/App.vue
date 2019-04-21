<template>
  <v-app
    id="app"
    style="overflow: hidden;"
  >
    <v-toolbar
      dense
      flat
      dark
      color="primary darken-3"
      class="accent--text pdx-toolbar--main"
    >
      <v-toolbar-title>
        PDX METRO FOOD ENVIRONMENT
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="nav">
        <router-link to="/">Map</router-link> <span style="color: white;"> | </span>
        <router-link to="/about">About</router-link>
      </div>
    </v-toolbar>
    <router-view :loading="loading" />
    <v-footer
      dark
      color="primary darken-3"
      class="pa-3 accent--text pdx-footer"
    >
      <v-layout column>
        <v-flex>
          View this project on <a href="https://github.com/treecasiano/pdx-food-map">GitHub</a>.
        </v-flex>
        <v-flex>
          &copy; {{ new Date().getFullYear() }} <a href="http://treecasiano.com">Tree Casiano</a>
        </v-flex>
      </v-layout>
    </v-footer>
    <div
      v-if="showSearchInstructions"
      class="pdx-floatingCardContainer--center"
    >
      <v-card class="pdx-leafletControl__card--instructions">
        <v-layout
          column
          align-end
        >
          <v-icon
            small
            color="accent"
            @click="showSearchInstructions=false"
            data-cy="welcomeWindow__button--close"
          >close</v-icon>
          <v-card-title class="title">
            Welcome to the PDX Metro Food Environment Map!
          </v-card-title>
          <v-flex class="text-sm-left">
            <v-divider></v-divider>
            <br>
            Explore the local food environment and see where the food deserts and sources of healthy food are in Portland, OR and the surrounding metropolitan area.
            <br>
            <br>
            Use the search tool in the upper right corner of the map to discover grocery stores and farmers markets near you!
          </v-flex>
        </v-layout>
      </v-card>
    </div>
  </v-app>
</template>

<script>
export default {
  async created() {
    this.loading = true;
    await this.$store.dispatch("farmersMarket/getFarmersMarketGeoJSON");
    await this.$store.dispatch("groceryStore/getGroceryStoreGeoJSON");
    await this.$store.dispatch("pdxTract/getPdxTractGeoJSON");
    this.loading = false;
  },
  data() {
    return {
      loading: false,
      showSearchInstructions: true,
    }
  },
  methods: {
    dismissInstructions() {
      this.showSearchInstructions = false;
    }
  }
}
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

#nav a,
.pdx-footer a {
  /* color: #fa8c0f; */
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

.pdx-floatingCardContainer--center {
  color: var(--v-secondary-base) !important;
  background-color: transparent;
  font-weight: 400;
  font-size: 16px;
  height: 400px;
  left: 50%;
  margin-left: -200px;
  margin-top: -200px;
  opacity: 0.95;
  position: absolute;
  top: 50%;
  width: 400px;
  z-index: 11000;
}

.pdx-leafletControl__card--instructions {
  background-color: var(--v-primary-darken3) !important;
  color: var(--v-accent-lighten2) !important;
  padding: 15px 15px 25px 15px;
}
</style>
