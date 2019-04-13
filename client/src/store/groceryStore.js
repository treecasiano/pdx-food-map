import groceryStoreApi from "../api/groceryStore";

const actions = {
  async getGroceryStoreList({ commit }) {
    const groceryStoreList = await groceryStoreApi.list();
    return commit("setGroceryStoreList", groceryStoreList.data);
  },
  async getGroceryStoreGeoJSON({ commit }) {
    const groceryStoreGeoJSON = await groceryStoreApi.getGeoJSON();
    return commit("setGroceryStoreGeoJSON", groceryStoreGeoJSON.data);
  },
  async search({ commit }, params) {
    const results = await groceryStoreApi.search(params);
    return commit("setGroceryStoreSearchResults", results.data);
  },
  clearSearchResults({ commit }) {
    return commit("clearSearchResults");
  }
};

const mutations = {
  setGroceryStoreList(state, groceryStoreData) {
    state.groceryStoreList = groceryStoreData;
  },
  setGroceryStoreGeoJSON(state, groceryStoreData) {
    state.groceryStoreGeoJSON = groceryStoreData;
  },
  setGroceryStoreSearchResults(state, groceryStoreData) {
    state.groceryStoreSearchResults = groceryStoreData;
  },
  clearSearchResults(state) {
    state.groceryStoreSearchResults = [];
  }
};

const state = {
  groceryStoreList: [],
  groceryStoreGeoJSON: {},
  groceryStoreSearchResults: []
};

const getters = {};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
