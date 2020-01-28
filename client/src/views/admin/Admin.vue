<template>
  <v-container fill-height align-center>
    <v-layout column>
      <v-flex>
        <v-btn @click="logout" color="primary" small>Log Out</v-btn>
        <div class="primary--text">
          <h1>Admin</h1>
        </div>
      </v-flex>
      <v-flex> </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { removeCookie } from "tiny-cookie";
export default {
  methods: {
    logout() {
      removeCookie("jwt");
      document.location = "/";
    }
  }
};
</script>
