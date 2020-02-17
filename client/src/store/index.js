import Vue from "vue";
import Vuex from "vuex";

import csaDropoffSite from "./csaDropoffSite";
import ctranRoute from "./ctranRoute";
import ctranStop from "./ctranStop";
import farmersMarket from "./farmersMarket";
import foodPantry from "./foodPantry";
import groceryStore from "./groceryStore";
import map from "./map";
import pdxTract from "./pdxTract";
import session from "./session";
import trailClarkCounty from "./trailClarkCounty";
import trimetRoute from "./trimetRoute";
import trimetStop from "./trimetStop";

Vue.use(Vuex);

const vuexStore = new Vuex.Store({
  modules: {
    csaDropoffSite,
    ctranRoute,
    ctranStop,
    farmersMarket,
    foodPantry,
    groceryStore,
    map,
    pdxTract,
    session,
    trailClarkCounty,
    trimetRoute,
    trimetStop,
  },
});

if (window.Cypress) {
  window.__store__ = vuexStore;
}

export default vuexStore;
