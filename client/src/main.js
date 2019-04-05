import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import Vuetify from "vuetify";
import "../node_modules/vuetify/dist/vuetify.min.css";
import colors from "vuetify/es5/util/colors";
import "../node_modules/leaflet/dist/leaflet.css";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

// register Vue2Leaflet components
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component("l-popup", LPopup);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false;

Vue.use(L);
Vue.use(Vuetify, {
  theme: {
    primary: colors.green,
    secondary: colors.lightGreen,
    accent: colors.lime,
    error: colors.red,
    warning: colors.deepOrange,
    info: colors.lightBlue,
    success: colors.lightBlue
  }
});
init();

async function init() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}
