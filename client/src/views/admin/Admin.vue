<template>
  <v-container fill-height fluid>
    <v-layout column>
      <v-flex xs12 pa-1>
        <v-tabs
          v-model="tab"
          @change="
            object =>
              this.$router.push({ name: 'adminObject', params: { object } })
          "
        >
          <v-tab href="#farmersMarket" ripple>Farmers Markets</v-tab>
          <v-tab href="#foodPantry" ripple>Food Pantries</v-tab>
          <v-tab href="#groceryStore" ripple>Grocery Stores</v-tab>

          <v-tab-item key="1" value="farmersMarket">
            <tab-farmers-market
              :mode="$route.params.mode"
              object="farmersMarket"
              @success="notifySuccess"
              @failure="notifyFailure"
            ></tab-farmers-market>
          </v-tab-item>
          <v-tab-item key="2" value="foodPantry">
            <tab-food-pantry
              :mode="$route.params.mode"
              object="foodPantry"
              @success="notifySuccess"
              @failure="notifyFailure"
            ></tab-food-pantry>
          </v-tab-item>
          <v-tab-item key="3" value="groceryStore">
            <tab-grocery-store
              :mode="$route.params.mode"
              object="groceryStore"
              @success="notifySuccess"
              @failure="notifyFailure"
            ></tab-grocery-store>
          </v-tab-item>
        </v-tabs>
      </v-flex>
      <div class="d-flex justify-end">
        <v-btn text small @click="logout" color="primary">Log Out</v-btn>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import TabFarmersMarket from "./TabFarmersMarket";
import TabFoodPantry from "./TabFoodPantry";
import TabGroceryStore from "./TabGroceryStore";
import { removeCookie } from "tiny-cookie";
import { mapMutations } from "vuex";
export default {
  components: { TabFarmersMarket, TabFoodPantry, TabGroceryStore },
  created() {
    this.tab = this.$route.params.object;
  },
  data() {
    return {
      tab: null,
    };
  },
  methods: {
    logout() {
      removeCookie("jwt");
      document.location = "/";
      this.sessionLogout();
    },
    notifyFailure() {
      this.failureNotification();
    },
    notifySuccess() {
      this.successNotification();
    },
    ...mapMutations({
      sessionLogout: "session/logout",
    }),
  },
  notifications: {
    successNotification: {
      title: "Succeeded",
      message: "",
      type: "success",
    },
    failureNotification: {
      title: "Failed",
      message: "",
      type: "warn",
    },
  },
};
</script>
