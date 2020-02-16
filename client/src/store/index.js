import Vue from "vue";
import Vuex from "vuex";

import csaDropoffSite from "./csaDropoffSite";
import ctranStop from "./ctranStop";
import farmersMarket from "./farmersMarket";
import foodPantry from "./foodPantry";
import groceryStore from "./groceryStore";
import map from "./map";
import pdxTract from "./pdxTract";
import session from "./session";
import trimetStop from "./trimetStop";

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  modules: {
    csaDropoffSite,
    ctranStop,
    farmersMarket,
    foodPantry,
    groceryStore,
    map,
    pdxTract,
    session,
    trimetStop,
  },
});

if (window.Cypress) {
  window.__store__ = vuexStore;
}

export default vuexStore;
