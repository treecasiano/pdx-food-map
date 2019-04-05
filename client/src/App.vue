<template>
  <div id="app">
    <v-toolbar>
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
  </div>
</template>

<style>
/* GLOBAL STYLES  */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
</style>
