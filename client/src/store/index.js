import Vue from "vue";
import Vuex from "vuex";

import example from "./example";
import groceryStore from "./groceryStore";
import pdxTract from "./pdxTract";

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  modules: {
    example,
    groceryStore,
    pdxTract
  }
});

if (window.Cypress) {
  window.__store__ = vuexStore;
}

export default vuexStore;
