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
      class="accent--text title"
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
    <router-view />
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
  </v-app>
</template>

<style>
/* GLOBAL STYLES  */
@import url("https://fonts.googleapis.com/css?family=Poppins");

#app {
  font-family: "Poppins", sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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

.pdx-footer {
  padding: 10px;
  height: 60px !important;
}
</style>
