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
      color="primary darken-4"
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
            color="primary"
            @click="showSearchInstructions=false"
            data-cy="welcomeWindow__button--close"
          >close</v-icon>
          <v-card-title>
            Welcome to the PDX Metro Food Environment Map!
          </v-card-title>
          <v-flex class="text-sm-left">
            <v-divider></v-divider>
            <br>
            Explore the local food environment and see where the food deserts and sources of healthy food are in the City of Roses and the surrounding metropolitan area.
            <br>
            <br>
            Use the search tool in the upper right corner of the map to discover grocery stores and farmers markets within a mile of an address you provide.
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
@import url("https://fonts.googleapis.com/css?family=Poppins");

#app {
  font-family: "Poppins", sans-serif !important;
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
  color: #fa8c0f;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #cddc39;
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
  color: #795548 !important;
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
</style>
