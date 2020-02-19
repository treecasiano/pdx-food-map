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
import { removeCookie } from "tiny-cookie";
export default {
  components: { TabFarmersMarket, TabFoodPantry },
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
    },
    notifyFailure() {
      this.failureNotification();
    },
    notifySuccess() {
      this.successNotification();
    },
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
