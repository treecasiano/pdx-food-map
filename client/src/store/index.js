import Vue from "vue";
import Vuex from "vuex";

import farmersMarket from "./farmersMarket";
import groceryStore from "./groceryStore";
import pdxTract from "./pdxTract";
import session from "./session";

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  modules: {
    farmersMarket,
    groceryStore,
    pdxTract,
    session
  }
});

if (window.Cypress) {
  window.__store__ = vuexStore;
}

export default vuexStore;
