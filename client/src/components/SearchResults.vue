<template>
  <div>
    <div>
      <h2>
        Farmers Markets
      </h2>
      {{ searchResultFarmersMarket }}
    </div>
    <div>
      <h2>Grocery Stores</h2>
      {{ searchResultGroceryStore }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MapLayers",
  computed: {
    ...mapState({
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
    }),
  },
  data() {
    return {};
  },
};
</script>
