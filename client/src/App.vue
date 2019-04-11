<template>
  <v-app id="app">
    <v-toolbar
      dense
      flat
      dark
      class="accent--text"
    >
      <v-toolbar-title>
        PDX METRO FOOD ENVIRONMENT
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="nav">
        <router-link to="/">Map</router-link> |
        <router-link to="/about">About</router-link>
      </div>
    </v-toolbar>
    <router-view />
  </v-app>
</template>

<style>
/* GLOBAL STYLES  */
@import url("https://fonts.googleapis.com/css?family=Anton");

#app {
  font-family: "Anton", Helvetica, Arial, sans-serif;
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

#nav a {
  color: #fa8c0f;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #cddc39;
}

#nav a:hover {
  opacity: 0.8;
}
</style>
