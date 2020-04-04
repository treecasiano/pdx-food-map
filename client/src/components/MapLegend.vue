<template>
  <v-container class="ml-1">
    <v-row no-gutters justify="center">
      <v-col cols="2">
        <div class="legendClass povertyRateClass-1"></div>
      </v-col>
      <v-col cols="2">
        <div class="legendClass povertyRateClass-2"></div>
      </v-col>
      <v-col cols="2">
        <div class="legendClass povertyRateClass-3"></div>
      </v-col>
      <v-col cols="2">
        <div class="legendClass povertyRateClass-4"></div>
      </v-col>
      <v-col cols="2">
        <div class="legendClass povertyRateClass-5"></div>
      </v-col>
      <v-col cols="10" class="mt-1">
        <div class="caption primary--text">Low -----------------------------> High</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MapLegend",
};
</script>

<style>
.legendCaption {
  font-size: 10px;
}
.legendClass {
  border: 1px solid grey;
  height: 0.8rem;
  margin: 0;
  padding: 0;
  opacity: 0.5;
}
.legendTitle {
  font-weight: bold;
}
.povertyRateClass-1 {
  background: #f7f7f7;
}
.povertyRateClass-2 {
  background: #cccccc;
}
.povertyRateClass-3 {
  background: #969696;
}
.povertyRateClass-4 {
  background: #636363;
}
.povertyRateClass-5 {
  background: #252525;
}
</style>
