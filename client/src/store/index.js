import Vue from "vue";
import Vuex from "vuex";

import example from "./example";

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  modules: {
    example
  }
});

if (window.Cypress) {
  window.__store__ = vuexStore;
}

export default vuexStore;