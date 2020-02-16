import Vue from "vue";
import Vuex from "vuex";

import csaDropoffSite from "./csaDropoffSite";
import farmersMarket from "./farmersMarket";
import foodPantry from "./foodPantry";
import groceryStore from "./groceryStore";
import map from "./map";
import pdxTract from "./pdxTract";
import session from "./session";

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  modules: {
    csaDropoffSite,
    farmersMarket,
    foodPantry,
    groceryStore,
    map,
    pdxTract,
    session,
  },
});

if (window.Cypress) {
  window.__store__ = vuexStore;
}

export default vuexStore;
