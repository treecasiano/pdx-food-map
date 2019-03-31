import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "../node_modules/vuetify/dist/vuetify.min.css";

Vue.config.productionTip = false;
Vue.use(Vuetify);

init();

async function init() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}
