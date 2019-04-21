import Vue from "vue";
import Vuex from "vuex";

import farmersMarket from "./farmersMarket";
import groceryStore from "./groceryStore";
import pdxTract from "./pdxTract";

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  modules: {
    farmersMarket,
    groceryStore,
    pdxTract
  }
});

if (window.Cypress) {
  window.__store__ = vuexStore;
}

export default vuexStore;
